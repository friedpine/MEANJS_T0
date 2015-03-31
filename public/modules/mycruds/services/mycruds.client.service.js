'use strict';

//Mycruds service used to communicate Mycruds REST endpoints
angular.module('mycruds').factory('Mycruds', ['$resource',
	function($resource) {
		return $resource('mycruds/:mycrudId', { mycrudId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);