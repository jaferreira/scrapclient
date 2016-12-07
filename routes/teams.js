var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/scrap';

var getDetailGame = function (db,name, callback) {
    var collection = db.collection('games');
    collection.find().toArray(function (err, items) {
        if (err) {
            console.log('error');
            reject(err);
        } else {
            console.log('db ' + items);
            callback(items);
        }
    });
}


router.get('/livestats/:teams', function (req, res, next) {
    data = {'team' : req.params.teams};
    console.log(data);
    res.render('teams',data);
});

module.exports = router;