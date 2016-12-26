// Application object with angular route dependency ([] is mandatory)
// ngRoute comes from the Angular Route file we installed
var myApp = angular.module('myApp', ['ngRoute', 'videosharing-embed']);

// Setting up all te routes
myApp.config(function($routeProvider){
	// Which url we want (in this case, home page)
	$routeProvider.when('/', {
		// Specify which controller we want to use when the user goes to this route (in this case, PostsController)
		controller: 'PostsController',
		// Specify which template url will be used when the user goes to this route (in this case, views/posts.html)
		templateUrl: 'views/posts.html'
	})
	// Getting all the posts
	.when('/posts', {
		controller: 'PostsController',
		templateUrl: 'views/posts.html'
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
