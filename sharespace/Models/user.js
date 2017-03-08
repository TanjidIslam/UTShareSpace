// Required module(s)
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Schema
var userSchema = mongoose.Schema({
	first_name:{
		type: String,
		required: true
	},
	last_name:{
		type: String,
		required: true
	},
	username:{
		type: String,
		unique: true,
		required: true
	},
	school:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	posts_added:{
		type: [String],
		default: []
	},
	amount_posts:{
		type: Number,
		default: 0
	},
	amount_votes:{
		type: Number,
		default: 0
	},
	date_joined:{
		type: Date,
		default: Date.now()
	}
});

// Save function (save) that encrypts password
userSchema.pre('save', function(next){

	// Assign to user current user
	var user = this;

	// Case where password is modified or new
	if (this.isModified('password') || this.isNew){

		// Salt password
		bcrypt.genSalt(10, function(err, salt){

			if (err) {
				return next(err);
			}
			// Hash password
			bcrypt.hash(user.password, salt, function(err, hash){
				if (err) {
					return next(err);
				}
				// Assign encrypted password to user password
				user.password = hash;
				next();
			});
		});

	// Otherwise, move on
	} else {
		return next();
	}
});

// Compare password function (comparePassword) that compares user's password with the password entered
userSchema.methods.comparePassword = function(passw, cb){

	// Compare two passwords
    bcrypt.compare(passw, this.password, function(err, isMatch){

    	// Case where there is an error, return error
        if (err) {
            return cb(err);
        }

        // Otherwise, move on
        cb(null, isMatch);
    });
};

// Make User object accessible from other files (module.exports) such as app.js
var User = module.exports = mongoose.model('User', userSchema);

// Get user function (getUserById) by their id
module.exports.getUserById = function(username, callback){
	User.find({username}, callback);
}

// Update user posts function (update_user_posts) by its id
module.exports.update_user_posts = function(id, user, options, callback){
	var query = {_id: id};
	var update = {
		amount_posts: user.amount_posts
	}
	User.findOneAndUpdate(query, update, options, callback);
}

// Update user votes function (update_user_votes) by its id
module.exports.update_user_votes = function(username, user, options, callback){
	var query = {username: username};
	var update = {
		amount_votes: user.amount_votes
	}
	User.findOneAndUpdate(query, update, options, callback);
}
