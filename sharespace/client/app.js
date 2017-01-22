// Application object with angular route dependency ([] is mandatory)
// ngRoute comes from the Angular Route file we installed
var myApp = angular.module('myApp', ['ngRoute', 'videosharing-embed']);

// Setting up all te routes
myApp.config(function($routeProvider){
	// Getting all the posts
	$routeProvider.when('/', {
		controller: 'PostsController',
		templateUrl: 'views/posts.html'
	})
	// Getting all the posts by specified tag
	.when('/posts/tag/:val', {
		controller: 'PostsController',
		templateUrl: 'views/posts_by_tag.html'
	})
	// Getting specific post by id
	.when('/posts/details/:id', {
		controller: 'PostsController',
		templateUrl: 'views/post_details.html'
	})
	// Adding a new post
	.when('/posts/add', {
		controller: 'PostsController',
		templateUrl: 'views/add_post.html'
	})
	// Editing a new post by id
	.when('/posts/edit/:id', {
		controller: 'PostsController',
		templateUrl: 'views/edit_post.html'
	})
	// If none of the above, redirect to the home page
	.otherwise({
		redirectTo: '/'
	});
});
