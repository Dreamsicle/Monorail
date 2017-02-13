var config = require('./config')
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = config.port

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

http.createServer(function(request, response, err) {
    
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri)
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain", "X-Powered-By": "labHTTP"});
      response.end()
      return
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain", "X-Powered-By": "labHTTP"})
        response.write(err + "\n")
        response.end();
        return
      }

      response.writeHead(200, {"X-Powered-By": "labHTTP"});
      response.write(file, "binary")
      response.end();
    });
  });
}).listen(parseInt(port, 10))

console.log("labHTTP running on port " + port + ".");
