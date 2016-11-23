var myApp = angular.module('myApp');

myApp.controller('upload_images', ['$scope', '$http', '$location', function($scope, $http, $location){

	$scope.uploadImages = function(){

		// For each file in files
		for (i = 0; i < $scope.myFile.length; i++) {
			// Assign file, create data and append it
			var file = $scope.myFile[i]
			var fd = new FormData;
			fd.append('file', file);
			// Upload file
			$http.post('/api/multer', fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(response){
				// Get images as response
				console.log(response);
			})
		}
	}
}]);
