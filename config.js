// Website name and URL
// By default, you can go to https://local.racklab.xyz (points to localhost) using the keys obtainable from the official page or using self-signed certs.

const URL = 'https://local.racklab.xyz'
const name = 'Test Website'

// Server type
// Should be any JS file under the servertypes directory, omit the .js
const servertype = 'basic'

// Default port to listen on (If using SSL/HTTPS, set it to 443. Automatic redirects for port 80 will be set up.)
const web_port = 443

// Actual port listened on (use for overrides)
const port = process.argv[2] || web_port;

// SSL
// Enter the full path.
const key = '/home/danPixl/.mySSL/Let\'s Encrypt/local.racklab/server.key'
const cert = '/home/danPixl/.mySSL/Let\'s Encrypt/local.racklab/server.crt'

// Password protection
const username = 'username'
const password = 'password'

module.exports = {servertype, key, cert, username, password, URL, websiteName: name, port};
