angular.module('myApp')
 
.controller('InsideCtrl', function($scope, $stateParams, AuthService, API_ENDPOINT, $http, $state) {

    $scope.getInfo = function() {

    	// Get username from parameters
    	var username = $stateParams.username;

    	// GET request that gets the user's information
        $http.get('/api/' + 'username').then(function(result){
            $scope.user = result.data.user;
        });
    };
 
    $scope.logout = function(){
        $scope.user = null;
        AuthService.logout();
        $state.go('outside.login');
    };
});
