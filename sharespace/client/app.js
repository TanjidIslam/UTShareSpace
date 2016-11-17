// Create app object with angular route dependency ([] is mandatory)
// ngRoute comes from the Angular Route file we installed
var myApp = angular.module('myApp', ['ngRoute', 'videosharing-embed']);

// Setting up all te routes
myApp.config(function($routeProvider){
	// What url we want (in this case, the home page)
	$routeProvider.when('/', {
		// Specify which controller we want to use when the user goes to this route
		controller: 'PostsController',
		// Specify which template url will be used when the user goes to this route
		templateUrl: 'views/posts.html'
	})
	.when('/posts', {
		controller: 'PostsController',
		templateUrl: 'views/posts.html'
	})
	.when('/posts/details/:id', {
		controller: 'PostsController',
		templateUrl: 'views/post_details.html'
	})
	.when('/posts/add', {
		controller: 'PostsController',
		templateUrl: 'views/add_post.html'
	})
	.when('/posts/edit/:id', {
		controller: 'PostsController',
		templateUrl: 'views/edit_post.html'
	})
	// If none of the above, redirect to the home page
	.otherwise({
		redirectTo: '/'
	});
});
