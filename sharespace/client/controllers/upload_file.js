var myApp = angular.module('myApp');

myApp.controller('upload_files', ['$scope', '$http', '$location', function($scope, $http, $location){

	$scope.uploadFile = function(){

		var file = $scope.myFile
		var upload_url = '/api/multer'
		var fd = new FormData;
		fd.append('file', file);
		$http.post(upload_url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(response){
			console.log(response.path);
		})
	}
}]);
