var config = require('./config')
    auth = require('http-auth'),
    port = config.port

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

console.log("Manager started.")


// I'd like to make a note that a lot of the work on the basic servers we already done by this guy:
// https://gist.github.com/ryanflorence/701407
// Mad props to him. 
var server = require('./servertypes/' + config.servertype)
server

console.log("labHTTP running on port " + port + ".");