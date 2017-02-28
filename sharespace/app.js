// Required module(s)
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database.js')
var multer  = require('multer');
var del = require('del');
var jwt = require('jwt-simple');

// post.js required functionality assigned to Post
var Post = require('./Models/post.js')

// user.js required functionality assigned to User
var User = require('./Models/user.js')

// Create bundle for API routes
var app = express();

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
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Middleware to initialize morgan
app.use(morgan('dev'));

// Middleware to initialize passport
app.use(passport.initialize());

// Connect to mongoose database
mongoose.connect(config.database);

// Pass our current passport to the passport configuration
require('./config/passport.js')(passport);

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

// Get all the posts by specified search
app.get('/api/posts/search/:_search', function(req, res){

	// Get search string
	search_string_with_ = req.params._search;

	// Convert it to a string where "_" is replaced by " "
	search_string_without_ = req.params._search.replace(/_/g, " ");

	// Convert it to a list of strings
	search_list = search_string_with_.split("_");

	Post.getPostsBySearch(search_list, search_string_without_, function(err, posts){
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

// Signup new user
app.post('/api/signup', function(req, res){

	// If username or password is missing, return false
	if (!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.school || !req.body.password) {
		res.json({success: false, msg: 'Please pass username and password.'})

	// Otherwise, assign values passed to database
	} else {
		var newUser = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			school: req.body.school,
			password: req.body.password
		});

		// Call save function to encrypt password of new user
		newUser.save(function(err) {

			// Case where user already exists
			if (err) {
				res.json({success: false, msg: 'Username already exists.'})

			// Case where user doesn't exist
			} else {
				res.json({success: true, msg: 'Succesfully created user.'})
			}
		});
	}
});

// Update existing user's post information
app.put('/api/users/posts/:_id', function(req, res){

	// Get id
	var id = req.params._id;

	// Get user details through body parser
	var user = req.body;

	User.updateUser(id, user, {}, function(err, post){
		if (err){
			throw err;
		}
		res.json(user);
	});
});

// Authenticate already existing user
app.post('/api/authenticate', function(req, res) {

	// Try to find already existing user
	User.findOne({

		// Assign username to username
		username: req.body.username
  	}, function(err, user){

  		// Case where there's an error
    	if (err) throw err;

    	// Case where user does not exist
    	if (!user){
      		res.send({success: false, msg: 'Authentication failed. User not found.'});

      	// Case where user does exist
    	} else {

    		// Check if password entered matches the user's password
      		user.comparePassword(req.body.password, function(err, isMatch){

      			// Case where there is a match
        		if (isMatch && !err) {
          			
          			// Create user token
          			var token = jwt.encode(user, config.secret);
          			
          			// Return JWT token
          			res.json({success: true, token: 'JWT ' + token});

          		// Case where is not a match
        		} else {
          			res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        		}
      		});
    	}
	});
});

// Get user's information
app.get('/api/:_username', passport.authenticate('jwt', { session: false}), function(req, res){

	// Get user's token using function getToken
	var token = getToken(req.headers);

	// Case where token was returned
	if (token) {

		// Decode JWT
    	var decoded = jwt.decode(token, config.secret);

    	// Find user ased on his username
    	User.findOne({
    		username: decoded.username
    	}, function(err, user) {

    		// Case where there is an error
        	if (err) throw err;

        	// Case where user does not exist
        	if (!user) {
        		return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});

        	// Case where user exists
        	} else {
          		res.json({success: true, user});
        	}
    	});

    // Case where token was not returned
  	} else {
    	return res.status(403).send({success: false, msg: 'No token provided.'});
  	}
});

// Get token function (getToken) that get's users token
getToken = function (headers) {

	// If authorized headers exist
	if (headers && headers.authorization) {

		// Split token based on space
    	var parted = headers.authorization.split(' ');

    	// Case where index one exists
    	if (parted.length === 2) {
      		return parted[1];

      	// Case where index one does not exist
    	} else {
    		return null;
    	}

    // If authorized headers does not exist
  	} else {
  		return null;
  }
};

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
