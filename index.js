var config = require('./config')
    cluster = require('cluster'),
    port = config.port

const numCPUs = require('os').cpus().length

if (process.getuid && process.getuid() === 1000) {
    console.log("Please run as root.")
    return
}

if (cluster.isMaster) {
    console.log("Manager started.")
}

    var serverstart = require('./serverstart')
    serverstart

if (cluster.isMaster) {
    console.log("labHTTP starting on port " + port + " with " + numCPUs + " threads.")
}

if (cluster.isMaster) {
    console.log(`Manager PID is ${process.pid}.`)
<<<<<<< HEAD
}
=======
    console.log("labHTTP running on port " + port + " with " + numCPUs + " threads.")
}

>>>>>>> 465030f098d4653177f44ef45bc9b0ba74255a3d
