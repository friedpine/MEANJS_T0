'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mycruds = require('../../app/controllers/mycruds.server.controller');

	// Mycruds Routes
	app.route('/mycruds')
		.get(mycruds.list)
		.post(users.requiresLogin, mycruds.create);

	app.route('/mycruds/:mycrudId')
		.get(mycruds.read)
		.put(users.requiresLogin, mycruds.hasAuthorization, mycruds.update)
		.delete(users.requiresLogin, mycruds.hasAuthorization, mycruds.delete);

	// Finish by binding the Mycrud middleware
	app.param('mycrudId', mycruds.mycrudByID);
};
