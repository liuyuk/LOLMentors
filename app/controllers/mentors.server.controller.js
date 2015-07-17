'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mentor = mongoose.model('Mentor'),
	_ = require('lodash');

/**
 * Create a Mentor
 */
exports.create = function(req, res) {
	var mentor = new Mentor(req.body);
	mentor.user = req.user;

	mentor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mentor);
		}
	});
};

/**
 * Show the current Mentor
 */
exports.read = function(req, res) {
	res.jsonp(req.mentor);
};

/**
 * Update a Mentor
 */
exports.update = function(req, res) {
	var mentor = req.mentor ;

	mentor = _.extend(mentor , req.body);

	mentor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mentor);
		}
	});
};

/**
 * Delete an Mentor
 */
exports.delete = function(req, res) {
	var mentor = req.mentor ;

	mentor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mentor);
		}
	});
};

/**
 * List of Mentors
 */
exports.list = function(req, res) { 
	Mentor.find().sort('-created').populate('user', 'displayName').exec(function(err, mentors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mentors);
		}
	});
};

/**
 * Mentor middleware
 */
exports.mentorByID = function(req, res, next, id) { 
	Mentor.findById(id).populate('user', 'displayName').exec(function(err, mentor) {
		if (err) return next(err);
		if (! mentor) return next(new Error('Failed to load Mentor ' + id));
		req.mentor = mentor ;
		next();
	});
};

/**
 * Mentor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mentor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
