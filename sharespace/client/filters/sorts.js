// Application object
var myApp = angular.module('myApp');

// Name of the filter, a globally available filter in out app module
myApp.filter('sorting', function() {

  	// Function to invoke by Angular each time. Angular passes in the "posts" argument which are all the posts
  	// in our container plus "myFilter" that controls the type of sorting functionality we want to trigger
	return function (posts, myFilter){

		// Case where we want to sort posts based on date added (selection sort)
		if (myFilter == "added") {

			// For each index of each post
			for (var i = -1; ++i < posts.length;) {
				for (var m = j = i; ++j < posts.length;) {

					// If date created of previous post is less than the post after
					if (posts[m].date_created < posts[j].date_created) {
						m = j;
					}
				}

				// Swap posts
      			var t = posts[m];
      			posts[m] = posts[i];
      			posts[i] = t;
			}

			// Retrun sorted posts
			return posts;

		// Case where we want to sort posts based on date updated (selection sort)
		} else if (myFilter == "updated") {

			// Define list updated
			var list_updated = [];

			// Define list added
			var list_added = [];

			// For each posts
			for (i = 0; i < posts.length; i++) {

				// Case where date created equals date updated
				if (posts[i].date_created == posts[i].date_updated) {

					// Push post on list added
					list_added.push(posts[i]);

				// Case where date created does not equal date updated
				} else {

					// Push post on list updated
					list_updated.push(posts[i]);

				}
			}

			// Sort lists updated
			// For each index of each post
			for (var i = -1; ++i < list_updated.length;) {
				for (var m = j = i; ++j < list_updated.length;) {

					// If date updated of previous post is less than the post after
					if (list_updated[m].date_updated < list_updated[j].date_updated) {
						m = j;
					}
				}

				// Swap posts
      			var t = list_updated[m];
      			list_updated[m] = list_updated[i];
      			list_updated[i] = t;
			}

			// Sort list added
			// For each index of each post
			for (var i = -1; ++i < list_added.length;) {
				for (var m = j = i; ++j < list_added.length;) {

					// If date created of previous post is less than the post after
					if (list_added[m].date_updated < list_added[j].date_updated) {
						m = j;
					}
				}

				// Swap posts
      			var t = list_added[m];
      			list_added[m] = list_added[i];
      			list_added[i] = t;
			}

			// Concatenate two lists and assign them to posts
			var posts = list_updated.concat(list_added);

			// Return sorted posts
			return posts;

		// Case where we want to sort posts based on votes (selection sort)
		} else if (myFilter == "votes") {

			// For each index of each post
			for (var i = -1; ++i < posts.length;) {
				for (var m = j = i; ++j < posts.length;) {

					// If votes of previous post is leen than the post after
					if (posts[m].votes < posts[j].votes) {
						m = j;
					}
				}

				// Swap posts
      			var t = posts[m];
      			posts[m] = posts[i];
      			posts[i] = t;
			}

			// Return sorted posts
			return posts;

		// Case where we want to sort posts based on trends
		} else if (myFilter == "trending") {

			// To be completed
			console.log("To be completed");

		}

		// Default case (each time page is loaded)
		// Case where posts or length of posts do not exist
	    if (!posts && !posts.length) {

	    	// Return none
	    	return;

	    // Case where posts and length of posts exist
	    } else {

	    	// For each index of each post
			for (var i = -1; ++i < posts.length;) {
				for (var m = j = i; ++j < posts.length;) {

					// If date created of previous post is less than the post after
					if (posts[m].date_created < posts[j].date_created) m = j;
				}

				// Sawp posts
      			var t = posts[m];
      			posts[m] = posts[i];
      			posts[i] = t;
			}

			// Return sorted posts
	    	return posts;
	    }
  	};
});
