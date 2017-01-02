// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
myApp.controller('tags', ['$scope', function($scope){

	// Trigger the function add_tag
	$scope.add_tag = function(button_text){

		// To be completed
		console.log("Add tag to field");

    }
}]);
