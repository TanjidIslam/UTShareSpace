// Application object
var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
myApp.controller('sort_controller', ['$scope', function($scope){

	// Set initial value of sorting property
	$scope.sort_property = "createdAt";

	// Set initial value of sorting status
	$scope.sort_status = "false";

	// Trigger the function sort_button
	$scope.sort_button = function(propertyName){

		// Case where user selects to sort based on date that posts were added
		if (propertyName == "createdAt") {

			// Sort based on date added
			$scope.sort_property = "createdAt";
			// Set status to false
			$scope.sort_status = "false";

		// Case where user selects to sort based on date that posts were updated
		} else if (propertyName == "updatedAt") {

			// Sort based on date updated (note that variable date is used, not updatedAt)
			$scope.sort_property = "date";
			// Set status to false
			$scope.sort_status = "false";

		// Case where user selects to sort based on the amount of votes
		} else if (propertyName == "votes") {

			// Sort based on votes
			$scope.sort_property = "votes";
			// Sert status to true
			$scope.sort_status = "true";

		// Case where user selects to sort based on trends
		} else {

			// Print a simple statement mentioning "To be completed"
			console.log("To be completed.")
		}
    }
}]);
