// I'd like to make a note that a lot of the work on the basic servers were already done by this guy:
// https://gist.github.com/ryanflorence/701407
// Mad props to him.

require('any-promise/register/bluebird');

var config = require(process.cwd() + '/config')
    http2 = require('http2'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs-promise'),
    fsSync = require('fs'),
    Remarkable = require('remarkable'),
    hljs = require("highlight.js"),
    request = require('request'),
    port = config.port,
    page = process.cwd() + '/templates/page.html',
    Promise = require('bluebird'),
    co = require('co'),
    minimatch = require('minimatch');

co(function*() {
  let extensionPaths = yield fs.readdir(process.cwd() + '/extensions');

  let extensions = {early: [], normal: [], late: []};
  extensionPaths.forEach(function(e) {
    let extension = require(process.cwd() + '/extensions/' + e.replace(/\..*?$/, ''));
    let handlers = [];

    if (typeof extension.configNamespace !== "undefined") {
      handlers = extension(config.extensions[extension.configNamespace]);
    } else {
      handlers = extension();
    }

    extensions.early = extensions.early.concat(handlers.filter((e) => (typeof e.priority === 'undefined' ? false : e.priority === 'early')));
    extensions.normal = extensions.normal.concat(handlers.filter((e) => (typeof e.priority === 'undefined' ? true : e.priority === 'normal')));
    extensions.late = extensions.late.concat(handlers.filter((e) => (typeof e.priority === 'undefined' ? false : e.priority === 'late')));
  });

  const keys = {
    key: yield fs.readFile(config.key),
    cert: yield fs.readFile(config.cert)
  }
  
  var convertmd = new Remarkable({
    langPrefix: 'language-',
    html: true,
    linkify: true,
  });
  
  function handler(uri, response) {
    var filename = path.join(process.cwd() + '/content/', uri !== '/' ? uri : 'index.md')

    if (path.basename(filename) == 'config'){
      response.writeHead(418, { 'X-Powered-By': 'Monorail Teapot' })
      response.write('SERVER_WARN: I\'m a teapot.')
      response.end()
      return
    }

    fs.exists(filename).then(function (exists) {
      var filetype = "application/octet-stream";

      if (path.extname(filename) == ".js" ) {
        filetype = 'text/javascript'
      } else {
        if (path.extname(filename) == ".html" || path.extname(filename) == ".md" || uri == '/'){ filetype = 'text/html' } else if (path.extname(filename) == ".css" ) { filetype = 'text/css' }
      }

      let forwarded = false;
 
      let resobj = {
        errCode: exists ? 200 : 404,
        body: '',
        forward: function(path) {
          forwarded = path;
        },
        headers: exists ? {'X-Powered-By': 'Monorail', 'Content-Type': filetype} : {'X-Powered-By': 'Monorail'},
        request: {
          path: uri
        }
      };

      for (let e of extensions.early.filter(e => (typeof e.matchPath !== 'undefined' ? minimatch(uri === '/' ? '/index.md' : uri, e.matchPath) : new RegExp('^' + (e.matchErr).toString().replace(/9/g, '.') + '$').test(resobj.errCode)))) {
        e.handle(resobj);
        if (forwarded) {
          break;
        }
      }

      if (forwarded) {
        return handler(forwarded, response);
      }

      if (!exists && !resobj.body) {
        response.writeHead(404, {'X-Powered-By': 'Monorail'})
        response.end()
        return
      } else if (!exists && resobj.body) {
        response.writeHead(resobj.errCode, resobj.headers);
        response.write(resobj.body);
        response.end();
        return;
      }
      
      if (resobj.body === '') {
        if (fsSync.statSync(filename).isDirectory()) filename += 'index.md'
  
        fs.readFile(filename, 'binary').then(function (file) {
          var markdown = file
  
          if (path.extname(filename) == '.md' && resobj.body === '') {
            let file = fsSync.readFileSync(page, "binary");
            var processedpage = file.replace('%content%', convertmd.render(markdown)),
                processedpage = processedpage.replace('%title%', path.basename(filename).replace(/\.[^\/.]+$/, ' - ') + config.websiteName).replace(/%URL%/ig, config.URL).replace(/%websiteName%/g, config.websiteName),
                processedpage = processedpage.replace('%footer-backto%', '<a href="' + config.URL + '"><p class="backto">Back to  ' + config.websiteName + '</p></a>')
            resobj.body += processedpage;
            response.push(process.cwd() + '/content/css/page.css')
            response.push(process.cwd() + '/content/css/prism.css')
            response.push(process.cwd() + '/content/js/prism.js')
            response.push(process.cwd() + '/content/js/sw.js')
          } else if (resobj.body === '') {
            if (path.extname(filename).substring(0, 3) == ".js" ){ 
              var file = file.replace(/%name%/ig, config.websiteName).replace(/%URL%/ig, config.URL)
              resobj.body += file;
            } else {
              resobj.body += file;
            }
          }
        }).catch(function(err) {
          if (resobj.body === '') {
            resobj.errCode = 500;
            resobj.body = err;
          } // can't figure out how to fix this error
        }).finally(function() {
          for (let e of extensions.normal.filter(e => (typeof e.matchPath !== 'undefined' ? minimatch(uri === '/' ? '/index.md' : uri, e.matchPath) : new RegExp('^' + (e.matchErr).toString().replace(/9/g, '.') + '$').test(resobj.errCode)))) {
            e.handle(resobj);
            if (forwarded) {
              break;
            }
          }

          if (forwarded) {
            return handler(forwarded, response);
          }

          for (let e of extensions.late.filter(e => (typeof e.matchPath !== 'undefined' ? minimatch(uri === '/' ? '/index.md' : uri, e.matchPath) : new RegExp('^' + (e.matchErr).toString().replace(/9/g, '.') + '$').test(resobj.errCode)))) {
            e.handle(resobj);
            if (forwarded) {
              break;
            }
          }

          if (forwarded) {
            return handler(forwarded, response);
          }

          response.writeHead(resobj.errCode, resobj.headers);
          response.write(resobj.body);
          response.end(); 
        });
        return;
      }

      for (let e of extensions.normal.filter(e => (typeof e.matchPath !== 'undefined' ? minimatch(uri === '/' ? '/index.md' : uri, e.matchPath) : new RegExp('^' + (e.matchErr).toString().replace(/9/g, '.') + '$').test(resobj.errCode)))) {
        e.handle(resobj);
        if (forwarded) {
          break;
        }
      }

      if (forwarded) {
        return handler(forwarded, response);
      }

      for (let e of extensions.late.filter(e => (typeof e.matchPath !== 'undefined' ? minimatch(uri === '/' ? '/index.md' : uri, e.matchPath) : new RegExp('^' + (e.matchErr).toString().replace(/9/g, '.') + '$').test(resobj.errCode)))) {
        e.handle(resobj);
        if (forwarded) {
          break;
        }
      }

      if (forwarded) {
        return handler(forwarded, response);
      }

      response.writeHead(resobj.errCode, resobj.headers);
      response.write(resobj.body);
      response.end(); 
    }).catch(function(err) {
      response.writeHead(500, {'Content-Type': 'text/plain', 'X-Powered-By': 'Monorail'})
      response.write(err + '\n')
      response.end()
    });
  }

  http2.createServer(keys, function(request, response) {;
    handler(url.parse(request.url).pathname, response);
  }).listen(parseInt(port, 10))
  
  http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd(), uri)
  
    response.writeHead(200);
    response.write('<html><head><meta http-equiv="refresh" content="0; url=' + config.URL + uri + '" /></head></html>', 'binary', {'X-Powered-By': 'Monorail', 'Content-Security-Policy': 'upgrade-insecure-requests'});
    response.end();
  }).listen(parseInt(80, 10));
})
