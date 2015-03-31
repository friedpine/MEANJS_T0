'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mycrud Schema
 */
var MycrudSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mycrud name',
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

mongoose.model('Mycrud', MycrudSchema);