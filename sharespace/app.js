// Module that will be required
var express = require('express');

// Object that represents express application
var app = express();

// Modules that will be required
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer  = require('multer');
var del = require('del');

// Define storage specifications for images and files
var storage = multer.diskStorage({
	// Create destination that that images and files will be uploaded
    destination: function (req, file, cb) {
        cb(null, 'client/uploads/');
    },
    // Generate random number to assign images and files
    filename: function (req, file, cb) {
        cb(null, (Math.floor(Math.random() * 100000000000) + 1) + file.originalname);
    }
});

// Assign storage specifications
var upload = multer({ storage: storage });

// Specify static folder (public directory) of client
app.use(express.static(__dirname + '/client'));

// Middleware to initialize the bodyParser
app.use(bodyParser.json());

// post.js functionality assigned to Post
Post = require('./models/post')

// Connect to Mongoose
mongoose.connect('mongodb://localhost/sharespace');

// Database object
var db = mongoose.connection;

// Route for home page (get all posts)
app.get('/', function(req, res){
	Post.getPosts(function(err, posts){
		if (err){
			throw err;
		}
		res.json(posts);
	});
});

// Get all the posts
app.get('/api/posts', function(req, res){
	Post.getPosts(function(err, posts){
		if (err){
			throw err;
		}
		res.json(posts);
	});
});

// Get all the posts containing specified tag
app.get('/api/posts/tag/:_val', function(req, res){
	Post.getPostsByTag(req.params._val, function(err, posts){
		if (err){
			throw err;
		}
		res.json(posts);
	});
});

// Get specific post by its id
app.get('/api/posts/:_id', function(req, res){
	Post.getPostById(req.params._id, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Create new post
app.post('/api/posts', function(req, res){

	// Get post details (data entered through form) through body parser
	var post = req.body;

	Post.addPost(post, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Update existing post
app.put('/api/posts/:_id', function(req, res){

	// Get id
	var id = req.params._id;

	// Get post details through body parser
	var post = req.body;

	Post.updatePost(id, post, {}, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Update image paths of existing post
app.put('/api/posts/:_id/image_path', function(req, res){

	// Get id
	var id = req.params._id;

	// Get post details through body parser
	var post = req.body;

	Post.updateImagePaths(id, post, {}, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Update file paths of existing post
app.put('/api/posts/:_id/file_path', function(req, res){

	// Get id
	var id = req.params._id;

	// Get post details through body parser
	var post = req.body;

	Post.updateFilePaths(id, post, {}, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Update votes of existing post
app.put('/api/posts/:_id/vote', function(req, res){

	// Get id
	var id = req.params._id;

	// Get post details through body parser
	var post = req.body;

	Post.updateVotes(id, post, {}, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Delete post
app.delete('/api/posts/:_id', function(req, res){

	// Get id
	var id = req.params._id;

	Post.removePost(id, function(err, post){
		if (err){
			throw err;
		}
		res.json(post);
	});
});

// Upload image(s) and file(s)
app.post('/api/multer',  upload.any(), function(req, res){

	// Get and respond with path
	var path = req.files[0].path.slice(6);

	res.json(path);
});

// Delete uploaded image(s) and file(s)
app.put('/api/multer', function(req, res){

	// Get paths through body parser
	var paths = req.body;

	// For each path, delete corresponding image
	for (i = 0; i < paths.length; i++) {
		del(['client' + paths[i]]);
	}
	res.json(paths);
});

// Port that application listens to
app.listen(3000);
console.log('Running on port 3000');
