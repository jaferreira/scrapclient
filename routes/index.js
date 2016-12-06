var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
/* GET home page. */
var url = 'mongodb://localhost:27017/scrap';
var findNextGames = function (db, callback) {
    var collection = db.collection('games');
    collection.find().toArray(function (err, items) {
        if (err) {
          console.log('error');
            reject(err);
        } else {
            console.log('asdasd ' + JSON.stringify(items));
            callback(items);
        }
    });
}

var games = [];
router.get('/', function(req, res, next) {
   var data = [];
  
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            findNextGames(db, function (items) {
                console.log(' --- ' + items);
                data = { 'nextGames' : items};
                games = data;
                console.log('teste----- ' + data.games);
                db.close();
                console.log('data - ' + data);
                res.render('index', data);

            })
        });
    

  
});

module.exports = router;
