'use strict';

//Setting up route
angular.module('mycruds').config(['$stateProvider',
	function($stateProvider) {
		// Mycruds state routing
		$stateProvider.
		state('listMycruds', {
			url: '/mycruds',
			templateUrl: 'modules/mycruds/views/list-mycruds.client.view.html'
		}).
		state('createMycrud', {
			url: '/mycruds/create',
			templateUrl: 'modules/mycruds/views/create-mycrud.client.view.html'
		}).
		state('viewMycrud', {
			url: '/mycruds/:mycrudId',
			templateUrl: 'modules/mycruds/views/view-mycrud.client.view.html'
		}).
		state('editMycrud', {
			url: '/mycruds/:mycrudId/edit',
			templateUrl: 'modules/mycruds/views/edit-mycrud.client.view.html'
		});
	}
]);