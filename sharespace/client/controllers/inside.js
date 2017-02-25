angular.module('myApp')

.controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS) {
    $scope.isAuthenticated = AuthService.isAuthenticated;
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
        AuthService.logout();
        $state.go('outside.login');
        alert("Session Lost! Sorry, you have to login again!");
    });
});
