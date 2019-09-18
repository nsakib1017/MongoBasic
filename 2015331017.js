const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const port = 3000

// set the view engine to ejs
app.set('view engine', 'ejs');

//set bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//MongoDB Connection
const url = 'mongodb://localhost:27017';
const dbName = 'TestDB';

//Create Document
app.post('/create', function (req, res) {
    const insertDocuments = function (db, callback) {
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }
        // Get the documents collection
        const collection = db.collection('collection1');
        // Insert some documents
        collection.insertMany([
            { name: req.body.name, balance: req.body.bal, mID: makeid(50) }
        ], function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted 1 documents into the collection");
            callback(result);
        });
    }
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        insertDocuments(db, function () {
            client.close();
        });
    });
    res.redirect('/');
});

//Read Document
app.get('/', function (req, res) {
    const findDocuments = function (db, callback) {
        // Get the documents collection
        const collection = db.collection('collection1');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            callback(docs);
            res.render('index',{info: docs});
        });
    }
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        const db = client.db(dbName);

            findDocuments(db, function () {
                client.close();
            });
    });

});

//Update Document
app.post('/update/:id',function(req,res){
    const updateDocument = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('collection1');
        // Update document where a is 2, set b equal to 1
        collection.updateOne({ mID : req.params.id }
          , { $set: { name : req.body.name, balance: req.body.bal } }, function(err, result) {
          assert.equal(err, null);
          assert.equal(1, result.result.n);
          console.log("Updated the document with the field a equal to 2");
          callback(result);
        });
      }
      MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        updateDocument(db, function () {
            client.close();
        });
    });
    res.redirect('/');
});

//Part of Update
app.post('/edit/:id',function(req,res){
    const findDocuments = function (db, callback) {
        // Get the documents collection
        const collection = db.collection('collection1');
        // Find some documents
        collection.find({mID : req.params.id}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            global.x=docs
            console.log(docs)
            callback(docs);
            res.render('update',{info: docs});
        });
    }
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        const db = client.db(dbName);

            findDocuments(db, function () {
                client.close();
            });
    });

});

//Delete Document
app.post('/delete/:id',function(req,res){
    const removeDocument = function(db, callback) {
        console.log("Hello",req.params)
        // Get the documents collection
        const collection = db.collection('collection1');
        // Delete document where a is 3
        collection.deleteOne({ mID :  req.params.id }, function(err, result) {
          assert.equal(err, null);
          assert.equal(1, result.result.n);
          console.log("Removed the document.");
          callback(result);
        });
      }
      MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        removeDocument(db, function() {
            client.close();
          });
    });
    res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
