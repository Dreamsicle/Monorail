var config = require('./config')
    cluster = require('cluster'),
    port = config.port

const numCPUs = require('os').cpus().length

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

if (config.key == undefined) {
  console.log("Please add the path to your SSL cert and key to config.js")
  console.log("SSL is required. If you don't have certs, check out the amazing Let's Encrypt (https://letsencrypt.org/) project.")
  return
}

if (cluster.isMaster) {
    console.log("Manager started.")
}

    var serverstart = require('./serverstart')
    serverstart

if (cluster.isMaster) {
    console.log(`Manager PID is ${process.pid}.`)
    console.log("labHTTP running on port " + port + " with " + numCPUs + " threads.")
}