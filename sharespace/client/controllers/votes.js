var myApp = angular.module('myApp');

myApp.controller('vote_button', ['$scope', function($scope){

	// Trigger the function click_btn
	$scope.click_btn = function(){
		$scope.post.votes += 1;
		$scope.hide_variable = !$scope.hide_variable;
    }
}]);
