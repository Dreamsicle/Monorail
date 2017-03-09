// I'd like to make a note that a lot of the work on the basic servers were already done by this guy:
// https://gist.github.com/ryanflorence/701407
// Mad props to him.

var config = require(process.cwd() + '/config')
    http2 = require('http2'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    Remarkable = require('remarkable'),
    hljs = require("highlight.js"),
    request = require('request'),
    port = config.port,
    page = process.cwd() + '/templates/page.html'

const keys = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
}

var convertmd = new Remarkable({
  langPrefix: 'language-',
  html: true,
  linkify: true,
});

http2.createServer(keys, function (request, response) {
  var uri = decodeURI(url.parse(request.url).pathname),
    filename = path.join(process.cwd() + '/content/', uri)

  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, {'X-Powered-By': 'labHTTP Pivot'})
      response.end()
      return
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.md'

    fs.readFile(filename, 'binary', function (err, file) {
      if (err) {
        response.writeHead(500, {'Content-Type': 'text/plain', 'X-Powered-By': 'labHTTP Pivot'})
        response.write(err + '\n')
        response.end()
        return
      }

      var markdown = file

      if (path.extname(filename) == ".js" ) {
        var filetype = 'text/javascript'
      } else {
        if (path.extname(filename) == ".html" ){ var filetype = 'text/html' } else if (path.extname(filename) == ".css" ) { var filetype = 'text/css' }
      }

      response.writeHead(200, {'X-Powered-By': 'labHTTP Pivot', 'Content-Type': filetype})
      if (path.extname(filename) == '.md' ) {
        fs.readFile(page, "binary", function(err, file) {
        var processedpage = file.replace('%content%', convertmd.render(markdown)),
            processedpage = processedpage.replace('%title%', path.basename(filename).replace(/\.[^/.]+$/, ' - ') + config.websiteName).replace(/%URL%/ig, config.URL).replace(/%websiteName%/g, config.websiteName),
            processedpage = processedpage.replace('%footer-backto%', '<a href="' + config.URL + '"><p class="backto">Back to  ' + config.websiteName + '</p></a>')
        response.push(process.cwd() + '/content/css/page.css')
        response.push(process.cwd() + '/content/css/prism.css')
        response.push(process.cwd() + '/content/js/prism.js')
        response.push(process.cwd() + '/content/js/sw.js')
        response.write(processedpage, 'binary')
        response.end()
        })
      } else {
        if (path.extname(filename).substring(0, 3) == ".js" ){ 
          var file = file.replace(/%name%/ig, config.websiteName).replace(/%URL%/ig, config.URL)
          response.write(file, 'binary')
          response.end()
          return
        }
        if (path.extname(filename) == ".js") {
          response.write(file, 'binary')
          response.end()
          return
        }
        response.write(file, 'binary')
        response.end()
      }
    })
  })
}).listen(parseInt(port, 10))

http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri)

  response.writeHead(200);
  response.write('<html><head><meta http-equiv="refresh" content="0; url=' + config.URL + uri + '" /></head></html>', 'binary', {'X-Powered-By': 'labHTTP Pivot', 'Content-Security-Policy': 'upgrade-insecure-requests'});
  response.end();
}).listen(parseInt(80, 10));