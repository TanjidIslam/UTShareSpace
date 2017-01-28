// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
myApp.controller('vote_button', ['$scope', function($scope){

	// Set initial values before button has been clicked

	// Set variable that contains current status of button
	var has_been_voted = false;

	// Set initial value of button to 'UpVote'
	$scope.vote_status = 'UpVote';

	// Set inital color of button to green
	$scope.button_color = true;

	// Trigger the function click_btn
	$scope.click_btn = function(){

		// Case where user UpVote's
		if (!has_been_voted) {

			// Set status of button to true
			has_been_voted = true;

			// Set value of button to 'DownVote'
			$scope.vote_status = 'DownVote';

			// Increment votes of post by 1
			$scope.post.votes += 1;

			// Set color of button to red
			$scope.button_color = false;

			// Add timestamp on vote
			$scope.post.voting_timestamps.push(Date.now());

		// Case where user DownVote's
		} else {

			// Set status of button to false
			has_been_voted = false;

			// Set value of button to 'DownVote'
			$scope.vote_status = 'UpVote';

			// Reduce votes of post by 1
			$scope.post.votes -= 1;

			// Set color of button to green
			$scope.button_color = true;
		}
    }
}]);
