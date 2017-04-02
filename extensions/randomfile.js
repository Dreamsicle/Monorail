module.exports = function() {
  return [
    {
      priority: 'early', // we're defining a file, so bypass 404s
      matchPath: '/randomfile.md',
      handle: function(res) {
        res.errCode = 200;
        res.body = `${Math.random()}`;
        res.headers['Content-Type'] = 'text/plain'; // make it plain text
      }
    }
  ]
}
