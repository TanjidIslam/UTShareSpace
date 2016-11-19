var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
// 2. $http module allows us to make API requests (GET - POST - PUT - DELETE)
// 3. $location deals with redirection
// 4. $routeParams allow us to get variables and values from forms
myApp.controller('PostsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	// Scope function to get the posts
	$scope.getPosts = function(){
		// GET request to get all the posts
		$http.get('/api/posts').success(function(response){
			// The response will be the posts
			$scope.posts = response;
		});
	}
	// Scope function to get specific post by id
	$scope.getPost = function(){
		// Get id
		var id = $routeParams.id;
		$http.get('/api/posts/' + id).success(function(response){
			// The response will be the post
			$scope.post = response;
		});
	}
	// Scope function that adds a post
	$scope.addPost = function(){
		// POST request to create a post
		// Second parameter is what we want to post
		$http.post('/api/posts', $scope.post).success(function(response){
			// Redirect
			window.location.href='#/posts';
		});
	}
		// Scope function that edits a post
	$scope.updatePost = function(){
		// Get id
		var id = $routeParams.id;
		// PUT request to edit a post
		// Second parameter is what we want to edit
		$http.put('/api/posts/' + id, $scope.post).success(function(response){
			// Redirect
			window.location.href='#/posts/details/' + id;
		});
	}
		// Scope function that deletes a post
		// We are not getting id from url. This time we are getting it from parameter.
	$scope.removePost = function(id){
		// DELETE request to edit a post
		$http.delete('/api/posts/' + id).success(function(response){
			// Redirect
			window.location.href='#/posts';
		});
	}
}]);
