module.exports = function() {
  return [
    {
      priority: 'early',
      matchErr: 499,
      handle: function(res) {
        res.body = `Error ${res.errCode}`;
      }
    }
  ]
}
