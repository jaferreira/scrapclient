var express = require('express');
var Client = require('node-rest-client').Client;
var router = express.Router();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/scrap';


router.get('/:game', function (req, res, next) {

    var viewData = { game: req.params.game};

    res.render('game', viewData);

});

module.exports = router;