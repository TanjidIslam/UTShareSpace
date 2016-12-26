// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
myApp.controller('vote_button', ['$scope', function($scope){

	// Trigger the function click_btn
	$scope.click_btn = function(){

		// Increment votes by 1
		$scope.post.votes += 1;
		// Switch hide variable
		$scope.hide_variable = !$scope.hide_variable;

    }
}]);
