angular.module('myApp')
 
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {

    $scope.getInfo = function() {
        $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result){
            console.log(result)
            $scope.user = result.data.user;
        });
    };
 
    $scope.logout = function(){
        AuthService.logout();
        $state.go('outside.login');
    };
});
