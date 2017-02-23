// Required module(s)
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
 
// user.js required functionality assigned to User
var User = require('../Models/user.js');

// database.js required functionality assigned to config
var config = require('../config/database.js');
 
 // exports function that handles the passport object 
module.exports = function(passport) {

  // Define strategy options opts
  var opts = {};

  // Assign current strategy options to opts
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  // Middleware to initialize passport strategy
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

    // Search for current user when accessing entry point
    User.findOne({id: jwt_payload.id}, function(err, user) {

          // Case where user was not found, return false
          if (err) {
              return done(err, false);
          }
          // Case where user was found, return user
          if (user) {
              done(null, user);

          // Case where user was found but there was an error, return false
          } else {
              done(null, false);
          }
      });
  }));
};
