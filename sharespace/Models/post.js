// Require mongoose
var mongoose = require('mongoose');

// Posts Schema
var postSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	keywords:{
		type: String,
		required: true
	},
	file:{
		type: String,
		required: true
	}
});

// How we make Post object accessible from outside (module.exports)
var Post = module.exports = mongoose.model('Post', postSchema);

// Get Posts function (getPosts()) that is also available from outise (module.exports)
module.exports.getPosts = function(callback, limit){
	Post.find(callback).limit(limit);
}
