'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Mycrud = mongoose.model('Mycrud'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, mycrud;

/**
 * Mycrud routes tests
 */
describe('Mycrud CRUD tests', function() {
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

		// Save a user to the test db and create new Mycrud
		user.save(function() {
			mycrud = {
				name: 'Mycrud Name'
			};

			done();
		});
	});

	it('should be able to save Mycrud instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mycrud
				agent.post('/mycruds')
					.send(mycrud)
					.expect(200)
					.end(function(mycrudSaveErr, mycrudSaveRes) {
						// Handle Mycrud save error
						if (mycrudSaveErr) done(mycrudSaveErr);

						// Get a list of Mycruds
						agent.get('/mycruds')
							.end(function(mycrudsGetErr, mycrudsGetRes) {
								// Handle Mycrud save error
								if (mycrudsGetErr) done(mycrudsGetErr);

								// Get Mycruds list
								var mycruds = mycrudsGetRes.body;

								// Set assertions
								(mycruds[0].user._id).should.equal(userId);
								(mycruds[0].name).should.match('Mycrud Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Mycrud instance if not logged in', function(done) {
		agent.post('/mycruds')
			.send(mycrud)
			.expect(401)
			.end(function(mycrudSaveErr, mycrudSaveRes) {
				// Call the assertion callback
				done(mycrudSaveErr);
			});
	});

	it('should not be able to save Mycrud instance if no name is provided', function(done) {
		// Invalidate name field
		mycrud.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mycrud
				agent.post('/mycruds')
					.send(mycrud)
					.expect(400)
					.end(function(mycrudSaveErr, mycrudSaveRes) {
						// Set message assertion
						(mycrudSaveRes.body.message).should.match('Please fill Mycrud name');
						
						// Handle Mycrud save error
						done(mycrudSaveErr);
					});
			});
	});

	it('should be able to update Mycrud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mycrud
				agent.post('/mycruds')
					.send(mycrud)
					.expect(200)
					.end(function(mycrudSaveErr, mycrudSaveRes) {
						// Handle Mycrud save error
						if (mycrudSaveErr) done(mycrudSaveErr);

						// Update Mycrud name
						mycrud.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Mycrud
						agent.put('/mycruds/' + mycrudSaveRes.body._id)
							.send(mycrud)
							.expect(200)
							.end(function(mycrudUpdateErr, mycrudUpdateRes) {
								// Handle Mycrud update error
								if (mycrudUpdateErr) done(mycrudUpdateErr);

								// Set assertions
								(mycrudUpdateRes.body._id).should.equal(mycrudSaveRes.body._id);
								(mycrudUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Mycruds if not signed in', function(done) {
		// Create new Mycrud model instance
		var mycrudObj = new Mycrud(mycrud);

		// Save the Mycrud
		mycrudObj.save(function() {
			// Request Mycruds
			request(app).get('/mycruds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Mycrud if not signed in', function(done) {
		// Create new Mycrud model instance
		var mycrudObj = new Mycrud(mycrud);

		// Save the Mycrud
		mycrudObj.save(function() {
			request(app).get('/mycruds/' + mycrudObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', mycrud.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Mycrud instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Mycrud
				agent.post('/mycruds')
					.send(mycrud)
					.expect(200)
					.end(function(mycrudSaveErr, mycrudSaveRes) {
						// Handle Mycrud save error
						if (mycrudSaveErr) done(mycrudSaveErr);

						// Delete existing Mycrud
						agent.delete('/mycruds/' + mycrudSaveRes.body._id)
							.send(mycrud)
							.expect(200)
							.end(function(mycrudDeleteErr, mycrudDeleteRes) {
								// Handle Mycrud error error
								if (mycrudDeleteErr) done(mycrudDeleteErr);

								// Set assertions
								(mycrudDeleteRes.body._id).should.equal(mycrudSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Mycrud instance if not signed in', function(done) {
		// Set Mycrud user 
		mycrud.user = user;

		// Create new Mycrud model instance
		var mycrudObj = new Mycrud(mycrud);

		// Save the Mycrud
		mycrudObj.save(function() {
			// Try deleting Mycrud
			request(app).delete('/mycruds/' + mycrudObj._id)
			.expect(401)
			.end(function(mycrudDeleteErr, mycrudDeleteRes) {
				// Set message assertion
				(mycrudDeleteRes.body.message).should.match('User is not logged in');

				// Handle Mycrud error error
				done(mycrudDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Mycrud.remove().exec();
		done();
	});
});