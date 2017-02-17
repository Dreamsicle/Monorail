var config = {}

// Change settings here

// Server type
// Should be any JS file under the servertypes directory, omit the .js
const servertype = 'basic'

// Port to listen on
const web_port = 443

// SSL
// Enter the path to your SSL key and certificate.
const key = './server.key'
const cert = './server.crt'

// Password protection
const username = "username"
const password = "password"

// Don't change anything beyond this point

config.servertype = servertype

config.port = process.argv[2] || web_port

config.key = key
config.cert = cert

config.username = username
config.password = password

module.exports = config