var config = {}

// Change settings here

// Server type
// Should be any JS file under the servertypes directory, omit the .js
const servertype = 'basic'

// Port to listen on (If using SSL/HTTPS, set it to 443. Automatic redirects for port 80 will be set up.)
const web_port = 443

// SSL
// Enter the full path.
const key = ''
const cert = ''

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