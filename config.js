var config = {}

// Change settings here

const web_port = 80

// Don't change anything beyond this point

config.port = process.argv[2] || web_port

module.exports = config;