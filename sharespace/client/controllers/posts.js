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

		// Define file paths
		$scope.post.file_paths = [];

		// If there are any elements to upload
		if ($scope.myImage || $scope.myFile){

			// Define total element list
			var total_upload_list = [];

			// If there are images
			if ($scope.myImage) {
				// Add each image to total upload list
				for (i = 0; i < $scope.myImage.length; i++) {
					total_upload_list.push($scope.myImage[i]);
				}
			}

			// Keep index track of images in order to know when files begin
			var seperation_index = total_upload_list.length;

			// If there are files
			if ($scope.myFile) {
				// Add each file to total upload list
				for (i = 0; i < $scope.myFile.length; i++) {
					total_upload_list.push($scope.myFile[i]);
				}
			}

			//console.log(total_upload_list);
			console.log(seperation_index);
			console.log(total_upload_list.length);
			// Define element counter that keepts track of when to stop uploading
			var element_counter = 0;

			// For each element in total upload list
			for (i = 0; i < total_upload_list.length; i++) {
				// Assign element, create data and append it
				var file = total_upload_list[i]
				var fd = new FormData;
				fd.append('file', file);

				// Check what kind of file
				if (i < seperation_index) {
					// Upload and get image url
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){
						// Get image path as response and push it to image paths
						$scope.post.image_paths.push(response);
						// Incremenet element counter
						element_counter = element_counter + 1;
						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {
							// If we have, POST request to create a post containing all image paths
							$http.post('/api/posts', $scope.post).success(function(response){window.location.href='#/posts'});
						}
					});
				} else {
					// Upload and get file url
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){
						// Get file path as response and push it to file paths
						$scope.post.file_paths.push(response);
						// Incremenet element counter
						element_counter = element_counter + 1;
						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {
							// If we have, POST request to create a post containing all image paths
							$http.post('/api/posts', $scope.post).success(function(response){window.location.href='#/posts'});
						}

					});
				}
			}
		// If there are no elements to upload
		} else {
			$http.post('/api/posts', $scope.post).success(function(response){window.location.href='#/posts'});
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
	$scope.removePost = function(id, image_paths, file_paths){

		// Concatenate paths of images and files in one array
		var paths = image_paths.concat(file_paths);

		// Delete images in these paths
		$http.put('/api/multer', paths).success(function(response){
			// DELETE request to delete a post
			$http.delete('/api/posts/' + id).success(function(response){
				// Redirect
				window.location.href='#/posts';
			});
		});
	}
}]);
