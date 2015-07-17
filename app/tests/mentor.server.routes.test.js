'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mentor = mongoose.model('Mentor'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mentor;

/**
 * Mentor routes tests
 */
describe('Mentor CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Mentor
		user.save(function() {
			mentor = {
				name: 'Mentor Name'
			};

			done();
		});
	});

	it('should be able to save Mentor instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mentor
				agent.post('/mentors')
					.send(mentor)
					.expect(200)
					.end(function(mentorSaveErr, mentorSaveRes) {
						// Handle Mentor save error
						if (mentorSaveErr) done(mentorSaveErr);

						// Get a list of Mentors
						agent.get('/mentors')
							.end(function(mentorsGetErr, mentorsGetRes) {
								// Handle Mentor save error
								if (mentorsGetErr) done(mentorsGetErr);

								// Get Mentors list
								var mentors = mentorsGetRes.body;

								// Set assertions
								(mentors[0].user._id).should.equal(userId);
								(mentors[0].name).should.match('Mentor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mentor instance if not logged in', function(done) {
		agent.post('/mentors')
			.send(mentor)
			.expect(401)
			.end(function(mentorSaveErr, mentorSaveRes) {
				// Call the assertion callback
				done(mentorSaveErr);
			});
	});

	it('should not be able to save Mentor instance if no name is provided', function(done) {
		// Invalidate name field
		mentor.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mentor
				agent.post('/mentors')
					.send(mentor)
					.expect(400)
					.end(function(mentorSaveErr, mentorSaveRes) {
						// Set message assertion
						(mentorSaveRes.body.message).should.match('Please fill Mentor name');
						
						// Handle Mentor save error
						done(mentorSaveErr);
					});
			});
	});

	it('should be able to update Mentor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mentor
				agent.post('/mentors')
					.send(mentor)
					.expect(200)
					.end(function(mentorSaveErr, mentorSaveRes) {
						// Handle Mentor save error
						if (mentorSaveErr) done(mentorSaveErr);

						// Update Mentor name
						mentor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mentor
						agent.put('/mentors/' + mentorSaveRes.body._id)
							.send(mentor)
							.expect(200)
							.end(function(mentorUpdateErr, mentorUpdateRes) {
								// Handle Mentor update error
								if (mentorUpdateErr) done(mentorUpdateErr);

								// Set assertions
								(mentorUpdateRes.body._id).should.equal(mentorSaveRes.body._id);
								(mentorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mentors if not signed in', function(done) {
		// Create new Mentor model instance
		var mentorObj = new Mentor(mentor);

		// Save the Mentor
		mentorObj.save(function() {
			// Request Mentors
			request(app).get('/mentors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mentor if not signed in', function(done) {
		// Create new Mentor model instance
		var mentorObj = new Mentor(mentor);

		// Save the Mentor
		mentorObj.save(function() {
			request(app).get('/mentors/' + mentorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mentor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mentor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mentor
				agent.post('/mentors')
					.send(mentor)
					.expect(200)
					.end(function(mentorSaveErr, mentorSaveRes) {
						// Handle Mentor save error
						if (mentorSaveErr) done(mentorSaveErr);

						// Delete existing Mentor
						agent.delete('/mentors/' + mentorSaveRes.body._id)
							.send(mentor)
							.expect(200)
							.end(function(mentorDeleteErr, mentorDeleteRes) {
								// Handle Mentor error error
								if (mentorDeleteErr) done(mentorDeleteErr);

								// Set assertions
								(mentorDeleteRes.body._id).should.equal(mentorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mentor instance if not signed in', function(done) {
		// Set Mentor user 
		mentor.user = user;

		// Create new Mentor model instance
		var mentorObj = new Mentor(mentor);

		// Save the Mentor
		mentorObj.save(function() {
			// Try deleting Mentor
			request(app).delete('/mentors/' + mentorObj._id)
			.expect(401)
			.end(function(mentorDeleteErr, mentorDeleteRes) {
				// Set message assertion
				(mentorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mentor error error
				done(mentorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mentor.remove().exec();
		done();
	});
});