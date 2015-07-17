'use strict';

// Mentors controller
angular.module('mentors').controller('MentorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mentors',
	function($scope, $stateParams, $location, Authentication, Mentors) {
		$scope.authentication = Authentication;

		// Create new Mentor
		$scope.create = function() {
			// Create new Mentor object
			var mentor = new Mentors ({
				name: this.name
			});

			// Redirect after save
			mentor.$save(function(response) {
				$location.path('mentors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mentor
		$scope.remove = function(mentor) {
			if ( mentor ) { 
				mentor.$remove();

				for (var i in $scope.mentors) {
					if ($scope.mentors [i] === mentor) {
						$scope.mentors.splice(i, 1);
					}
				}
			} else {
				$scope.mentor.$remove(function() {
					$location.path('mentors');
				});
			}
		};

		// Update existing Mentor
		$scope.update = function() {
			var mentor = $scope.mentor;

			mentor.$update(function() {
				$location.path('mentors/' + mentor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mentors
		$scope.find = function() {
			$scope.mentors = Mentors.query();
		};

		// Find existing Mentor
		$scope.findOne = function() {
			$scope.mentor = Mentors.get({ 
				mentorId: $stateParams.mentorId
			});
		};
	}
]);