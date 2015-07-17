'use strict';

// Configuring the Articles module
angular.module('mentors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mentors', 'mentors', 'dropdown', '/mentors(/create)?');
		Menus.addSubMenuItem('topbar', 'mentors', 'List Mentors', 'mentors');
		Menus.addSubMenuItem('topbar', 'mentors', 'New Mentor', 'mentors/create');
	}
]);