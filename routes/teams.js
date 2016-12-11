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
            
            callback(items);
        }
    });
}


router.get('/livestats/:team', function (req, res, next) {
    var team = req.params.team;
    
   var results = [];
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        getGameInfo(db, team, function (data) {
            
           var empates = 0;
            var vitorias = 0;
            var derrotas = 0;
            for (var i = 0, len = data[0].nextGame.GamesBetweenTeams.length; i < len; i++) {
                var game = data[0].nextGame.GamesBetweenTeams[i];
                
                if(game.HomeScore == game.AwayScore)
                {
                    console.log('Empate ' + game.HomeScore + " " +  game.AwayScore)
                    empates = empates + 1;
                    }
                else
                {
                if(game.SameHomeTeam )
                    {
                        if(game.HomeScore > game.AwayScore)
                        {
                            
                            vitorias = vitorias + 1;

                            }
                            else
                            {
                                derrotas = derrotas + 1;
console.log('Derrota ' + game.HomeScore + " " +  game.AwayScore);
                            }

                    }
                    else
                        if(game.HomeScore > game.AwayScore)
                            derrotas = derrotas +1;
                        else
                        {
                            console.log('Vitória ' + game.HomeScore + " " +  game.AwayScore);
                            
                            vitorias = vitorias +1;
                        }
                }
            }
             
            console.log('emaptes' + data[0].nextGame.GamesBetweenTeams.length);

            results = [vitorias,empates,derrotas];
            var rata = {'teste' : results};
            
            console.log('teste');
            viewData = {
                team: team,
                teamGraph: rata,
                teamInfo: data[0]
                
            };
            console.log('teste' + rata);
            db.close();
           

            
            res.render('teams', viewData);
        })
    });
});

module.exports = router;