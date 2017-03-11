var config = require('./config')
    cluster = require('cluster'),
    port = config.port

const numCPUs = require('os').cpus().length

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

if (config.key == '') {
    console.log("SSL is required to run Monorail Pivot.")
    console.log("If you need a certificate, we highly recommend the incredible service provided by Let's Encrypt. ")
    console.log("Our preferred tool is ZeroSSL (https://zerossl.com/free-ssl/#crt).")
    return
}

if (cluster.isMaster) {
    console.log("Manager started.")
}

    var serverstart = require('./internals/serverstart')
    serverstart

if (cluster.isMaster) {
    console.log("Monorail Pivot starting on port " + port + " with " + numCPUs + " threads.")
}