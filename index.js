const express = require('express');
const bodyParser= require('body-parser');
const request = require('request');
const mongoose = require('mongoose');

const instantMongoCrud = require('express-mongo-crud'); // require the module
var crud_options = { //specify options
    host: 'localhost:81'
}
const SMSCheck = require('./utils.js');


var mongoDB = 'mongodb://127.0.0.1/drugmon';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

const app = express();

app.use(bodyParser.json());

require('./api')(app,db,SMSCheck); //Import API SMS_GATEWAY

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

app.listen('81', () =>{
    console.log('Server started at port: 81');
});