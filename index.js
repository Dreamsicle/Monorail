var config = require('./config')
    auth = require('http-auth'),
    port = config.port

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

console.log("Manager started.")

var servertype = require('./servertypes/' + config.servertype)
servertype

console.log("labHTTP running on port " + port + ".");