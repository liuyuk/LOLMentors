'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mentor Schema
 */
var MentorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mentor name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Mentor', MentorSchema);