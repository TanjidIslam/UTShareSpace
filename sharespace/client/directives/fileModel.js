// Application object
var myApp = angular.module('myApp');

// Angular directive that links files to our scope variable
myApp.directive('fileModel', ['$parse', function($parse){

	// Return directive object
	return {

		// Restrict to attribute
		restrict: 'A',
		link: function(scope, element, attrs){

			// Parse to look at attributes
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			// When element changes, execute function below
			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files);
				})
			})
		}
	}
}])
