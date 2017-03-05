var config = require(process.cwd() + '/config'),
    numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  var server = require('./servertypes/' + config.servertype)
  server
}
