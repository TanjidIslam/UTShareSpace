angular.module('myApp')
 
.controller('LoginCtrl', function($scope, AuthService, $state) {
	$scope.user = {
    	username: '',
    	password: ''
  	};

  	$scope.login = function() {
    	AuthService.login($scope.user).then(function(msg) {
      	$state.go('inside');
    	}, function(errMsg) {
      	alert("Login Failed");
    	});
  	};
});
