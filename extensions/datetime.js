module.exports = function() {
  return [
    {
      priority: 'normal',
      /*
      Extensions priority:
      early (loaded and ran first, used when needing to skip sanity checks)
      normal (ran after early, should be used for extensions that modify content being served)
      late
      */ 
      matchPath: '/**',
      /*
      What URL the extension should be run on. Two asterisks can be used for all of them (like above).
      */
      handle: function(res) {
        res.errCode = 200;
        /*
        What status code this extension should work on. We're using 200 OK for this one, as it's the 'everythings good to go' status.
        */
        res.body = res.body.replace('%datetime%', new Date())
        /*
        Actually defining the body now. 
        */
      }
    }
  ]
}
