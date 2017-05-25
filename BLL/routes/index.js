var express = require('express');
var router = express.Router();
/* MongoDB Driver */
var mongo = require('mongodb').MongoClient;
/* To make item ID an object, since MongoDB does not use string IDs */
var objectId = require('mongodb').ObjectID;
/* Package for checking DB operation results */
var assert = require('assert');
var app = require('../../app');

var url = require('../../DAL/db');

/* Home Page with GET request for all data */
router.get('/', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

/* Insert Item */
router.post('/insert', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err); 
      console.log('Item inserted.');
      db.close();
    });
  });

  res.redirect('/');
});

/* Update Item */
router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  var id = req.body.id;

   mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err); 
      console.log('Item updated.');
      db.close();
    });
  });

  res.redirect('/');
});

/* Delete Item */
router.post('/delete', function(req, res, next) {
   var id = req.body.id;

   mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err); 
      console.log('Item deleted.');
      db.close();
    });
  });

  res.redirect('/');
});

module.exports = router;
