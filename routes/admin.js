var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/scrap';
var teams = [];
var findLeagues = function (db, callback) {
    var collection = db.collection('teams');
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

var insertGame = function(db,data,callback)
{
    var collection = db.collection("games");
    collection.remove({'name' : data.name},function(err,result){
        collection.insert(data,function(err,result){
            callback(result);
        })
    })
}

var insertTeams = function (db, data, callback) {
    console.log(data);
    var collection = db.collection('teams');
    collection.remove({}, function (err, result) {
        collection.insert(data, function (err, result) {

            callback(result);
        })
    });
}

var insertDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('leagues');
    // Insert some documents
    collection.update(
        { league: 'Portuguesa' },
        { league: 'Portuguesa' },
        { upsert: true },
        function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            //assert.equal(1, result.ops.length);
            console.log("Inserted 1 documents into the collection");
            callback(result);
        });
}

router.get('/scrapTeam/:team', function (req, res, next) {
    var client = new Client();
    console.log(req.params.team);
    // direct way 
    client.get("http://52.169.24.36/v1/scrap/team/" + req.params.team, function (data, response) {
        
        var result = {'name' : data.HomeTeam, 'nextGame' : data};


        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            insertGame(db, result, function (result) {
                console.log('yeahhh ' + result);
                db.close();
                res.render('admin', { 'teams': data });
            })
        });
        

        
    });

});
router.get('/bulkLeague', function (req, res, next) {
    var client = new Client();

    // direct way 
    client.get("http://52.169.24.36/v1/scrap/games/PT", function (data, response) {
        console.log(data);
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            insertTeams(db, data, function (result) {
                db.close();
                res.render('admin', { 'teams': data });
            })
        });

    });
});

router.get('/bulkDB', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        insertDocuments(db, function () {
            db.close();
        })

    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    var data = [];

    if (teams.length > 0)
        res.render('admin', teams);
    else {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            findLeagues(db, function (items) {

                data = { 'teams': items };
                teams = data;
                db.close();
                console.log('data - ' + JSON.stringify(data));
                res.render('admin', data);

            })
        });
    }



});

router.get('/scrapLeague', function (req, res, next) {
    console.log('teste');
});

module.exports = router;
