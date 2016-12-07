var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/scrap';



router.get('/livestats/:teams', function (req, res, next) {
    data = {'team' : req.params.teams};
    console.log(data);
    res.render('teams',data);
});

module.exports = router;