'use strict';

//Mentors service used to communicate Mentors REST endpoints
angular.module('mentors').factory('Mentors', ['$resource',
	function($resource) {
		return $resource('mentors/:mentorId', { mentorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);