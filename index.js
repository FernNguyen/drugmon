const express = require('express');
const bodyParser= require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const uuidV1 = require('uuid/v1');
const app_port = 8080;
const instantMongoCrud = require('express-mongo-crud'); // require the module

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');


const router = express.Router();



var crud_options = { //specify options
    host: 'localhost:'+app_port
}
const SMSCheck = require('./utils.js');


var mongoDB = 'mongodb://127.0.0.1/drugmon';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

const app = express();
app.use(bodyParser.json());

require('./api')(app,db,SMSCheck,uuidV1); //Import API SMS_GATEWAY

app.use(express.static(__dirname + '/public'));

app.get('/*.html', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
//
// app.get('/', function(req, res){
//     console.log('GETTTT');
//   res.redirect('/index.html');
// });

app.post('/send_message', function(req,res){
    console.log(req.body);
});
app.get('/messages', function(req,res){
   res.json({});
})
app.delete('/db_delete/:collection/:object_id', (req,res)=>{

    MongoClient.connect(mongoDB, function(err, db) {
        var collection = db.collection(req.params.collection);
        collection.deleteOne({ "_id" : mongoose.Types.ObjectId(req.params.object_id) }, function(err, result) {
            if(err == null){
                res.json({
                    status: true
                })
            }else{
                res.json({
                    status: false
                })
            }
        });

    })

        var deleteDocument = function(db, callback) {
        var collection = db.collection(req.params.collection);
        collection.deleteOne({ "_id" : req.params.object_id }, function(err, result) {
            if(err == null){
                console.log("Removed the document with the field a equal to 3");
            }

            callback(result);
        });
    }


    //     .toArray(function(error, data) {
    //     console.log(req.params.collection);
    //     if (error == null) {
    //         //res.json(data);
    //         console.log(db.collection.toString())
    //
    //         //data.remove();
    //     }else{
    //        // res.json(error);
    //     }
    // })


})
// app.use('/', (req,res)=>{

//     res.send(SMSCheck.validSmsSyntax('R312 33'));

//     // db.find({
//     // selector: {doc_type: 'messages'},
//     // fields: ['_id', 'from','doc_type'],
//     // sort: ['sms_received']
//     // }).then(function (result) {
//     // // handle result
//     // res.json(result);
//     // }).catch(function (err) {
//     // console.log(err);
//     // res.json(err);

//     // });
// })

app.use(instantMongoCrud(crud_options)); // use as middleware

app.listen(app_port, () =>{
    console.log('Server started at port: '+app_port);
});