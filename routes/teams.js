var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/scrap';

var getDetailGame = function (db, name, callback) {
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

var getGameInfo = function (db,teams, callback) {
    var collection = db.collection('games');
    collection.find({"name" : teams}).toArray(function (err, items) {
        if (err) {
            console.log('error');
            reject(err);
        } else {
            console.log('asdasd ' + JSON.stringify(items));
            callback(items);
        }
    });
}


router.get('/livestats/:team', function (req, res, next) {
    var team = req.params.team;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getGameInfo(db, team, function (data) {
            viewData = {
                team: team,
                teamInfo: data[0]
            };
            db.close();
            console.log(viewData);
            res.render('teams', viewData);
        })
    });
});

module.exports = router;