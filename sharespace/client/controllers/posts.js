// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
// 2. $http module allows us to make API requests (GET - POST - PUT - DELETE)
// 3. $location deals with redirection
// 4. $routeParams allow us to get variables and values from forms
myApp.controller('PostsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){

	// Scope function to get posts
	$scope.getPosts = function(){
		// GET request to get all the posts
		$http.get('/api/posts').success(function(response){
			// Response will be the posts
			$scope.posts = response;
		});
	}

	// Scope function to get posts by specified tag
	$scope.getPostsByTag = function(){

		// Get tag value
		var val = $routeParams.val;

		// GET request to get all the posts by specified tag
		$http.get('/api/posts/tag/' + val).success(function(response){

			// Assing to posts the response which will be the posts by specified tag
			$scope.posts = response;

			// Assign to value the specified tag value
			$scope.val = val
		});
	}

	$scope.getPostsBySearch = function(){

		// Get search value
		var search = $routeParams.search;

		// Get search bar element
		var search_bar_element = document.getElementById('search_bar');

		// Set its value to null (empty string)
		search_bar_element.value = "";

		// Convert string of words into list of words
		search = search.split(" ");

		// For every element in the array
		for (var i = search.length - 1; i >= 0; i--) {

			// If there are any extra spaces
			if (search === "") {

				// Remove them from the array
				search.splice(i, 1);
			}
		}

		// Remove all duplicates from list of tags
		search = search.filter( function(item, index, inputArray) {
				return inputArray.indexOf(item) == index;
        	});

		// Define search string variable
		var search_string = "";

		// For each search element in the list
		for (i = 0; i < search.length; i++) {
			// Add it to the search string variable
			search_string = search_string + search[i] + "_";
		}

		// Slice the last element of the search string variable
		search_string = search_string.slice(0, -1);

		// Assign search string to search
		var search = search_string;

		// GET request to get all the posts by specified search
		$http.get('/api/posts/search/' + search).success(function(response){

			// Assing to posts the response which will be the posts by specified search
			$scope.posts = response;

			// Assign to value the specified search with replacing "_" witg " "
			$scope.search_string = search_string.replace(/_/g, " ");
		});
	}

	// Scope function to get specific post by id
	$scope.getPost = function(){

		// Get id
		var id = $routeParams.id;

		// GET request that gets specific post by id
		$http.get('/api/posts/' + id).success(function(response){

			// Declare empty string
			var string_of_tags = "";

			// Loop through list of tags and add to string
			for (i = 0; i < response.tag_list.length; i++) {
				string_of_tags += response.tag_list[i] + " ";
			}

			// Reassign tag list as a string of tags
			response.tag_list = string_of_tags.slice(0, -1);

			// Response will be the post
			$scope.post = response;
		});
	}

	// Scope function that adds a post
	$scope.addPost = function(){

		// Assign date to date_created
		$scope.post.date_created = Date.now();

		// Assign date to date_updated
		$scope.post.date_updated = Date.now();

		// Assign date to date_display
		$scope.post.date_display = Date.now();

		// If tags exist
		if ($scope.post.tag_list) {

			// Convert string of tags into list of tags
			$scope.post.tag_list = $scope.post.tag_list.split(" ");

			// For every element in the array
			for (var i = $scope.post.tag_list.length - 1; i >= 0; i--) {

				// If there are any extra spaces
				if ($scope.post.tag_list[i] === "") {

					// Remove them from the array
					$scope.post.tag_list.splice(i, 1);

				}
			}

			// Remove all duplicates from list of tags
			$scope.post.tag_list = $scope.post.tag_list.filter( function(item, index, inputArray) {
				return inputArray.indexOf(item) == index;
        	});
		}

		// Define image paths
		$scope.post.image_paths = [];

		// Define file paths
		$scope.post.file_paths = [];

		// Case where there are image(s) and file(s) to upload
		if ($scope.myImage || $scope.myFile){

			// Define total element list
			var total_upload_list = [];

			// Case where there are image(s)
			if ($scope.myImage) {
				// Add each image to total upload list
				for (i = 0; i < $scope.myImage.length; i++) {
					total_upload_list.push($scope.myImage[i]);
				}
			}

			// Keep index track of images in order to know when file(s) begin
			var seperation_index = total_upload_list.length;

			// Case where there are file(s)
			if ($scope.myFile) {
				// Add each file to total upload list
				for (i = 0; i < $scope.myFile.length; i++) {
					total_upload_list.push($scope.myFile[i]);
				}
			}

			// Define element counter that keeps track of when to stop uploading
			var element_counter = 0;

			// For each element in total upload list
			for (i = 0; i < total_upload_list.length; i++) {

				// Assign element, create data and append it
				var file = total_upload_list[i]
				var fd = new FormData;
				fd.append('file', file);

				// Check whether upload is an image or a file through the seperation_index variable
				if (i < seperation_index) {

					// POST request that uploads image
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){

						// Get image path as response and push it to image paths
						$scope.post.image_paths.push(response);

						// Incremenet element counter by 1
						element_counter = element_counter + 1;

						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {

							// POST request to create a post containing all paths for both image(s) and file(s)
							$http.post('/api/posts', $scope.post).success(function(response){window.location.href='/#/'});
						}
					});
				} else {

					// POST request that uploads file
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){

						// Get file path as response and push it to file paths
						$scope.post.file_paths.push(response);

						// Incremenet element counter by 1
						element_counter = element_counter + 1;

						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {

							// POST request to create a post containing all paths for both image(s) and file(s)
							$http.post('/api/posts', $scope.post).success(function(response){window.location.href='/#/'});
						}
					});
				}
			}
		// Case where there are no image(s) or file(s) to upload
		} else {
			$http.post('/api/posts', $scope.post).success(function(response){window.location.href='/#/'});
		}
	}

	// Scope function that edits a post by id
	$scope.updatePost = function(){

		// Get id
		var id = $routeParams.id;

		// Update date to date_updated
		$scope.post.date_updated = Date.now();

		// Update date to date_display
		$scope.post.date_display = Date.now();

		// If tags exist
		if ($scope.post.tag_list && typeof $scope.post.tag_list === "string") {

			// Convert string of tags into list of tags
			$scope.post.tag_list = $scope.post.tag_list.split(" ");

			// For every element in the array
			for(var i = $scope.post.tag_list.length - 1; i >= 0; i--) {

				// If there are any extra spaces
				if($scope.post.tag_list[i] === "") {

					// Remove them from the array
					$scope.post.tag_list.splice(i, 1);

				}
			}

			// Remove all duplicates from list of tags
			$scope.post.tag_list = $scope.post.tag_list.filter(function(item, index, inputArray) {
				return inputArray.indexOf(item) == index;
        	});
		}

		// Case where there are image(s) and file(s) to upload
		if ($scope.myImage || $scope.myFile){

			// Define total element list
			var total_upload_list = [];

			// Case where there are image(s)
			if ($scope.myImage) {
				// Add each image to total upload list
				for (i = 0; i < $scope.myImage.length; i++) {
					total_upload_list.push($scope.myImage[i]);
				}
			}

			// Keep index track of images in order to know when file(s) begin
			var seperation_index = total_upload_list.length;

			// Case where there are file(s)
			if ($scope.myFile) {
				// Add each file to total upload list
				for (i = 0; i < $scope.myFile.length; i++) {
					total_upload_list.push($scope.myFile[i]);
				}
			}

			// Define element counter that keeps track of when to stop uploading
			var element_counter = 0;

			// For each element in total upload list
			for (i = 0; i < total_upload_list.length; i++) {

				// Assign element, create data and append it
				var file = total_upload_list[i]
				var fd = new FormData;
				fd.append('file', file);

				// Check whether upload is an image or a file through the seperation_index variable
				if (i < seperation_index) {

					// POST request that uploads image
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){

						// Get image path as response and push it to image paths
						$scope.post.image_paths.push(response);

						// Incremenet element counter by 1
						element_counter = element_counter + 1;

						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {

							// PUT request to edit a post
							// Second parameter is what we want to edit
							$http.put('/api/posts/' + id, $scope.post).success(function(response){

							// Declare empty string
							var string_of_tags = "";

							// Loop through list of tags and add to string
							for (i = 0; i < response.tag_list.length; i++) {
								string_of_tags += response.tag_list[i] + " ";
							}

							// Reassign tag list as a string of tags
							$scope.post.tag_list = string_of_tags.slice(0, -1);

							// Redirect
							window.location.href='#/posts/details/' + id;

							});
						}
					});
				} else {

					// POST request that uploads file
					$http.post('/api/multer', fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(response){

						// Get file path as response and push it to file paths
						$scope.post.file_paths.push(response);

						// Incremenet element counter by 1
						element_counter = element_counter + 1;

						// Check if we have uploaded all elements
						if (element_counter == total_upload_list.length) {

							// PUT request to edit a post
							// Second parameter is what we want to edit
							$http.put('/api/posts/' + id, $scope.post).success(function(response){

							// Declare empty string
							var string_of_tags = "";

							// Loop through list of tags and add to string
							for (i = 0; i < response.tag_list.length; i++) {
								string_of_tags += response.tag_list[i] + " ";
							}

							// Reassign tag list as a string of tags
							$scope.post.tag_list = string_of_tags.slice(0, -1);

							// Redirect
							window.location.href='#/posts/details/' + id;

							});
						}
					});
				}
			}
		// Case where there are no image(s) or file(s) to upload
		} else {

			// PUT request to edit a post
			// Second parameter is what we want to edit
			$http.put('/api/posts/' + id, $scope.post).success(function(response){

			// Declare empty string
			var string_of_tags = "";

			// Loop through list of tags and add to string
			for (i = 0; i < response.tag_list.length; i++) {
				string_of_tags += response.tag_list[i] + " ";
			}

			// Reassign tag list as a string of tags
			$scope.post.tag_list = string_of_tags.slice(0, -1);

			// Redirect
			window.location.href='#/posts/details/' + id;

			});
		}
	}

	// Scope function that removes single image
	$scope.remove_single_image = function(path){

		// Get id
		var id = $routeParams.id;

		// For each path in images
		for (i = 0; i < $scope.post.image_paths.length; i++) {
			// Case when path is found
			if (path == $scope.post.image_paths[i]) {
				// Remove path from images
				$scope.post.image_paths.splice(i, 1);
			}
		}

		// PUT request to edit images
		$http.put('/api/posts/' + id + '/image_path', $scope.post).success(function(response){});

		// PUT request that deletes images of the above paths
		$http.put('/api/multer', [path], $scope.post).success(function(response){});
	}

	// Scope function that removes single file
	$scope.remove_single_file = function(path){

		// Get id
		var id = $routeParams.id;

		// For each path in files
		for (i = 0; i < $scope.post.file_paths.length; i++) {
			// Case when path is found
			if (path == $scope.post.file_paths[i]) {
				// Remove path from files
				$scope.post.file_paths.splice(i, 1);
			}
		}

		// PUT request to edit images
		$http.put('/api/posts/' + id + '/file_path', $scope.post).success(function(response){});

		// PUT request that deletes images of the above paths
		$http.put('/api/multer', [path], $scope.post).success(function(response){});
	}

	// Scope function that updates votes
	$scope.update_votes = function(){

		// Get id
		var id = $routeParams.id;

		// PUT request to edit a post
		// Second parameter is what we want to edit
		$http.put('/api/posts/' + id + '/vote', $scope.post).success(function(response){

			// Redirect
			window.location.href='#/posts/details/' + id;
		});
	}

	// Scope function that deletes a post
	// We are not getting id from url. This time we are getting it from parameter.
	$scope.removePost = function(id, image_paths, file_paths){

		// Create dialog box that user confirms they want to delete post
		var result = confirm("Are you sure you want to delete this post?");

		// Case where they want to delete post
		if (result) {

			// Concatenate paths of images and files in one array
			var paths = image_paths.concat(file_paths);

			// PUT request that deletes images of the above paths
			$http.put('/api/multer', paths, $scope.post).success(function(response){

				// DELETE request to delete a post
				$http.delete('/api/posts/' + id).success(function(response){

					// Redirect
					window.location.href='/#/';
				});
			});

		// Case where they don't want to delete post
		} else {

			// Redirect to post
			window.location.href='#/posts/details/' + id;
		}
	}
}]);
