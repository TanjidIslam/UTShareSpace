// Require modules that we will need
var express = require('express');
// Object that represents express application
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to Mongoose
mongoose.connect('mongodb://localhost/sharespace');
// Database object
var db = mongoose.connection;

// Route for home page
app.get('/', function(req, res){
	res.send('Hello ShareSpace!')
});

// Port to listen
app.listen(3000);
console.log('Running on port 3000');
