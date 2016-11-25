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

		// Define image paths
		$scope.post.image_paths = [];
		// Assign length of files to a variable for later use
		var amount_files = $scope.myFile.length;
		// For each file in files
		for (i = 0; i < $scope.myFile.length; i++) {
			// Assign file, create data and append it
			var file = $scope.myFile[i]
			var fd = new FormData;
			fd.append('file', file);
			// Upload file
			$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){
				// Get image path as response and push it to paths
				$scope.post.image_paths.push(response);
				// Check if we have uploaded all images
				if (amount_files == $scope.post.image_paths.length) {
					// If we have, POST request to create a post containing all image paths
					$http.post('/api/posts', $scope.post).success(function(response){window.location.href='#/posts'});
				}
			});
		}
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
