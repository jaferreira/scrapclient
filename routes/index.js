var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = new Client();
 
// direct way 
client.get("http://52.169.24.36/v1/scrap/pt/sporting", function (data, response) {
    res.render('index',data);
});


  //res.render('index', { title: 'Express' });
});

module.exports = router;
