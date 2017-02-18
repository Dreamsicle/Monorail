var config = require('../config')
    https = require("https"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    auth = require('http-auth'),
    request = require('request'),
    port = config.port

var password_protection = auth.basic({
        realm: "labHTTP Server"
    }, (username, password, callback) => {
        callback(username === config.username && password === config.password)
    }
)

const keys = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
}

https.createServer(keys, password_protection, function(request, response) {
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd() + '/www/', uri)
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"X-Powered-By": "labHTTP"})
      response.end()
      return
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain", "X-Powered-By": "labHTTP"})
        response.write(err + "\n")
        response.end()
        return
      }

      response.writeHead(200, {"X-Powered-By": "labHTTP"})
      response.write(file, "binary")
      response.end()
    });
  });
}).listen(parseInt(port, 10))