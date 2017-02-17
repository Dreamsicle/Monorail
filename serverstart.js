var config = require('./config')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  console.log(config.servertype + " server started.")
} else {
var server = require('./servertypes/' + config.servertype)
server
}