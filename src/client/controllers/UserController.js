angular.module('appUserController', [])
.controller('UserController', ['$scope', function($scope) {
	$scope.UserLoggedIn = function() {
		return false;
	}
}]);