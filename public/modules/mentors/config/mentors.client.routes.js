'use strict';

//Setting up route
angular.module('mentors').config(['$stateProvider',
	function($stateProvider) {
		// Mentors state routing
		$stateProvider.
		state('listMentors', {
			url: '/mentors',
			templateUrl: 'modules/mentors/views/list-mentors.client.view.html'
		}).
		state('createMentor', {
			url: '/mentors/create',
			templateUrl: 'modules/mentors/views/create-mentor.client.view.html'
		}).
		state('viewMentor', {
			url: '/mentors/:mentorId',
			templateUrl: 'modules/mentors/views/view-mentor.client.view.html'
		}).
		state('editMentor', {
			url: '/mentors/:mentorId/edit',
			templateUrl: 'modules/mentors/views/edit-mentor.client.view.html'
		});
	}
]);