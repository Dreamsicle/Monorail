module.exports = function(config) {
  return [
    {
      priority: 'early',
      matchPath: '/**/*',
      handle: function(res) {
        if (config.hasOwnProperty(res.request.path)) {
          res.forward(config[res.request.path]);
        }
      }
    }
  ]
}

module.exports.configNamespace = 'forwards';
