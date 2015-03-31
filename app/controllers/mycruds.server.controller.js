'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mycrud = mongoose.model('Mycrud'),
	_ = require('lodash');

/**
 * Create a Mycrud
 */
exports.create = function(req, res) {
	var mycrud = new Mycrud(req.body);
	mycrud.user = req.user;

	mycrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mycrud);
		}
	});
};

/**
 * Show the current Mycrud
 */
exports.read = function(req, res) {
	res.jsonp(req.mycrud);
};

/**
 * Update a Mycrud
 */
exports.update = function(req, res) {
	var mycrud = req.mycrud ;

	mycrud = _.extend(mycrud , req.body);

	mycrud.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mycrud);
		}
	});
};

/**
 * Delete an Mycrud
 */
exports.delete = function(req, res) {
	var mycrud = req.mycrud ;

	mycrud.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mycrud);
		}
	});
};

/**
 * List of Mycruds
 */
exports.list = function(req, res) { 
	Mycrud.find().sort('-created').populate('user', 'displayName').exec(function(err, mycruds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mycruds);
		}
	});
};

/**
 * Mycrud middleware
 */
exports.mycrudByID = function(req, res, next, id) { 
	Mycrud.findById(id).populate('user', 'displayName').exec(function(err, mycrud) {
		if (err) return next(err);
		if (! mycrud) return next(new Error('Failed to load Mycrud ' + id));
		req.mycrud = mycrud ;
		next();
	});
};

/**
 * Mycrud authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mycrud.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
