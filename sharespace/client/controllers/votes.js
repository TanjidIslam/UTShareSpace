var myApp = angular.module('myApp');

myApp.controller('vote_button', ['$scope', function($scope){

	// Set initial values
	var has_been_voted = false;
	$scope.vote_status = 'Vote';
	$scope.button_color = true;

	// Trigger the function click_btn
	$scope.click_btn = function(){

		// Examine case of Vote and Unvote
		if (!has_been_voted) {
			has_been_voted = true;
			$scope.vote_status = 'Unvote';
			$scope.post.votes += 1;
			$scope.button_color = false;
		// liked
		} else {
			has_been_voted = false;
			$scope.vote_status = 'Vote';
			$scope.post.votes -= 1;
			$scope.button_color = true;
		}
    }
}]);
