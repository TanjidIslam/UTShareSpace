// Required module(s)
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Schema
var userSchema = mongoose.Schema({
	username:{
		type: String,
		unique: true,
		required: true
	},
	password:{
		type: String,
		required: true
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
