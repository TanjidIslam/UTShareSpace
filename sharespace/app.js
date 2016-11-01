// Require modules that we will need
var express = require('express');
// Object that represents express application
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

Post = require('./models/post')

// Connect to Mongoose
mongoose.connect('mongodb://localhost/sharespace');
// Database object
var db = mongoose.connection;

// Route for home page
app.get('/', function(req, res){
	res.send('Please use /posts for now')
});

app.get('/posts', function(req, res){
	Post.getPosts(function(err, posts){
		if (err){
			throw err;
		}
		res.json(posts);
	});
});

app.post('/posts', function(req, res){
	res.send({message: 'TODO Create new post'})
});

app.put('/posts', function(req, res){
	res.send({message: 'TODO Update existing post'})
});

app.delete('/posts', function(req, res){
	res.send({message: 'Cannot delete all posts, error status code returned'})
});

// Port to listen
app.listen(3000);
console.log('Running on port 3000');
