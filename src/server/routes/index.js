module.exports = function (app) {
  'use strict';

  var fs        = require('fs');
  var path      = require('path');
  var express   = require('express');
  var router    = express.Router();

  // Loop to load all routes files js
  {
    var files = fs.readdirSync("src/server/routes");
    for(var index in files) {
        var file = files[index];
        if (file === "index.js") continue;
        // skip non-javascript files
        if (path.extname(file) != ".js") continue;
        var routes = require("./" + path.basename(file));
        // Add router to handle routing
        routes(router);
    }
  }

  // 404 Handling
  router.get('*', function(req, res){
    res.json({
      callback:[],
      status:'404',
      message:'Page you request are not found',
    });
  });

  // set root index
  app.use('/api', router);

};