'use strict';

// Mycruds controller
angular.module('mycruds').controller('MycrudsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mycruds',
	function($scope, $stateParams, $location, Authentication, Mycruds) {
		$scope.authentication = Authentication;

		// Create new Mycrud
		$scope.create = function() {
			// Create new Mycrud object
			var mycrud = new Mycruds ({
				name: this.name
			});

			// Redirect after save
			mycrud.$save(function(response) {
				$location.path('mycruds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mycrud
		$scope.remove = function(mycrud) {
			if ( mycrud ) { 
				mycrud.$remove();

				for (var i in $scope.mycruds) {
					if ($scope.mycruds [i] === mycrud) {
						$scope.mycruds.splice(i, 1);
					}
				}
			} else {
				$scope.mycrud.$remove(function() {
					$location.path('mycruds');
				});
			}
		};

		// Update existing Mycrud
		$scope.update = function() {
			var mycrud = $scope.mycrud;

			mycrud.$update(function() {
				$location.path('mycruds/' + mycrud._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mycruds
		$scope.find = function() {
			$scope.mycruds = Mycruds.query();
		};

		// Find existing Mycrud
		$scope.findOne = function() {
			$scope.mycrud = Mycruds.get({ 
				mycrudId: $stateParams.mycrudId
			});
		};
	}
]);