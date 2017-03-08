// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
// 2. $http module allows us to make API requests (GET - POST - PUT - DELETE)
// 3. $location deals with redirection
// 4. $stateParams allow us to get variables and values from forms
myApp.controller('PostsController', ['$scope', '$http', '$location', '$stateParams', 'AuthService', function($scope, $http, $location, $stateParams, AuthService){

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
		var val = $stateParams.val;

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
		var search = $stateParams.search;

		// Get search bar element
		var search_bar_element = document.getElementById('search_bar');

		// Set its value to null (empty string)
		search_bar_element.value = "";

		// Convert string of words into list of words
		search = search.split(" ");

		// For every element in the array
		for (var i = search.length - 1; i >= 0; i--) {

			// If there are any extra spaces
			if (search[i] === "") {

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

		// GET request to get user's information
		$http.get('/api/' + 'memberinfo').then(function(result){

			// Assign user information to user
			$scope.user = result.data.user;

			// Get id
			var id = $stateParams.id;

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
		});
	}

	// Scope function that adds a post
	$scope.addPost = function(){

		// GET request to get user's information
		$http.get('/api/' + 'memberinfo').then(function(result){

			// Get user's information
			$scope.user = result.data.user;

			// Get user's id
			var id = $scope.user._id;

			// Increment amount of posts by 1
			$scope.user.amount_posts += 1;

			// Assign username to post creator
			$scope.post.user_created = $scope.user.username;

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

								// PUT request to update existing user's post information
								$http.put('/api/users/posts/' + id, $scope.user).success(function(response){});

								// POST request to create a post containing all paths for both image(s) and file(s)
								$http.post('/api/posts', $scope.post).success(function(response){window.location.href='/#/home'});
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

								// PUT request to update existing user's post information
								$http.put('/api/users/posts/' + id, $scope.user).success(function(response){});

								// POST request to create a post containing all paths for both image(s) and file(s)
								$http.post('/api/posts', $scope.post).success(function(response){window.location.href='/#/home'});
							}
						});
					}
				}
			// Case where there are no image(s) or file(s) to upload
			} else {

				// PUT request to update existing user's post information
				$http.put('/api/users/posts/' + id, $scope.user).success(function(response){});

				// POST request to create a post without pats of image(s) or file(s)
				$http.post('/api/posts', $scope.post).success(function(response){
					console.log(response);
					window.location.href='/#/home'
				});
			}
		});
	}

	// Scope function that edits a post by id
	$scope.updatePost = function(){

		// Get id
		var id = $stateParams.id;

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
		var id = $stateParams.id;

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
		var id = $stateParams.id;

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

	// Scope function that initializes vote button
	$scope.initial_votes = function(){

		// GET request to get user's information
		$http.get('/api/' + 'memberinfo').then(function(result){

			// Get user's information
			$scope.user = result.data.user;

			// Get user's id
			var user_id = $scope.user._id;

			// Get post's id
			var post_id = $stateParams.id;

			// GET request that gets specific post by id
			$http.get('/api/posts/' + post_id).success(function(response){

				// Get the users that have voted for this post
				users_voted = response.users_voted;

				// Case where user has not voted for this post
				if (users_voted.indexOf(user_id) == -1){

					// Set initial value of button to 'UpVote'
					$scope.vote_status = 'UpVote';

					// Set inital color of button to green
					$scope.button_color = true;

				// Case Where user has voted for this post
				} else {

					// Set initial value of button to 'DownVote'
					$scope.vote_status = 'DownVote';

					// Set inital color of button to red
					$scope.button_color = false;
				}
			});
		});
	}

	// Scope function that updates votes
	$scope.update_votes = function(){

		// GET request to get user's information
		$http.get('/api/' + 'memberinfo').then(function(result){

			// Get user's information
			$scope.user = result.data.user;

			// Get user's id
			var user_id = $scope.user._id;

			// Get user created id
			var user_created = $scope.post.user_created;

			// Get post's id
			var post_id = $stateParams.id;

			// Case where user UpVote's
			if ($scope.button_color == true) {

				// Set value of button to 'DownVote'
				$scope.vote_status = 'DownVote';

				// Increment votes of post by 1
				$scope.post.votes += 1;

				// Set color of button to red
				$scope.button_color = false;

				// Push user id into users voted
				$scope.post.users_voted.push(user_id);

				// Add timestamp on vote
				$scope.post.voting_timestamps.push(Date.now());

				// GET request that gets specific user by username
				$http.get('/api/users/' + user_created).success(function(response){

					// Assign response to user that created post
					$scope.user_created = response[0];

					// Increase amount of votes by 1
					$scope.user_created.amount_votes += 1;

					// PUT request to edit a user
					// Second parameter is what we want to edit
					$http.put('/api/users/votes/' + user_created, $scope.user_created).success(function(response){});	
				})

			// Case where user DownVote's
			} else {

				// Set value of button to 'DownVote'
				$scope.vote_status = 'UpVote';

				// Reduce votes of post by 1
				$scope.post.votes -= 1;

				// Set color of button to green
				$scope.button_color = true;

				// Remove user id from users voted
				$scope.post.users_voted.splice(user_id, 1);

				// GET request that gets specific user by id
				$http.get('/api/users/' + user_created).success(function(response){

					// Assign response to user that created post
					$scope.user_created = response[0];

					// Increase amount of votes by 1
					$scope.user_created.amount_votes -= 1;

					// PUT request to edit a user
					// Second parameter is what we want to edit
					$http.put('/api/users/votes/' + user_created, $scope.user_created).success(function(response){});	
				})

			}

			// PUT request to edit a post
			// Second parameter is what we want to edit
			$http.put('/api/posts/' + post_id + '/vote', $scope.post).success(function(response){

				// Redirect
				window.location.href='#/posts/details/' + post_id;
			});
		});
	}

	// Scope function gets details of other user
	$scope.get_other_user = function(){

		// Get user's username
		var username = $stateParams.username;

		// GET request that gets specific user by id
		$http.get('/api/users/' + username).success(function(response){
			$scope.user = response[0];
		})
	}

	// Scope function that deletes a post
	// We are not getting id from url. This time we are getting it from parameter.
	$scope.removePost = function(id, image_paths, file_paths){

		// Create dialog box that user confirms they want to delete post
		var result = confirm("Are you sure you want to delete this post?");

		// Case where they want to delete post
		if (result) {

			// GET request to get user's information
			$http.get('/api/' + 'memberinfo').then(function(result){

				// Get user's information
				$scope.user = result.data.user;

				// Get user's id
				var user_id = $scope.user._id;

				// Get post's id
				var post_id = $stateParams.id;

				// Increment amount of posts by 1
				$scope.user.amount_posts -= 1;

				// Concatenate paths of images and files in one array
				var paths = image_paths.concat(file_paths);

				// PUT request to update existing user's post information
				$http.put('/api/users/posts/' + user_id, $scope.user).success(function(response){});

				// PUT request that deletes images of the above paths
				$http.put('/api/multer', paths, $scope.post).success(function(response){

					// DELETE request to delete a post
					$http.delete('/api/posts/' + post_id).success(function(response){

						// Redirect
						window.location.href='/#/home';
					});
				});
			});

		// Case where they don't want to delete post
		} else {

			// Redirect to post
			window.location.href='/#/posts/details/' + id;
		}
	}
}]);
