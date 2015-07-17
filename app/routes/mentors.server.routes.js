'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mentors = require('../../app/controllers/mentors.server.controller');

	// Mentors Routes
	app.route('/mentors')
		.get(mentors.list)
		.post(users.requiresLogin, mentors.create);

	app.route('/mentors/:mentorId')
		.get(mentors.read)
		.put(users.requiresLogin, mentors.hasAuthorization, mentors.update)
		.delete(users.requiresLogin, mentors.hasAuthorization, mentors.delete);

	// Finish by binding the Mentor middleware
	app.param('mentorId', mentors.mentorByID);
};
