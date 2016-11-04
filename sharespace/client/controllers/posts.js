var myApp = angular.module('myApp');

// Name of the controller and:
// 1. $scope is what binds controller to the view (pass things back and forth)
// 2. $http module allows us to make API requests (GET - POST - PUT - DELETE)
// 3. $location deals with redirection
// 4. $routeParams allow us to get variables and values from forms
myApp.controller('PostsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
	console.log('PostsController loaded...');
	$scope.getPosts = function(){
		$http.get('/api/posts').success(function(response){
			$scope.posts = response;
		});
	}
}]);