'use strict';

// Configuring the Articles module
angular.module('mycruds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Mycruds', 'mycruds', 'dropdown', '/mycruds(/create)?');
		Menus.addSubMenuItem('topbar', 'mycruds', 'List Mycruds', 'mycruds');
		Menus.addSubMenuItem('topbar', 'mycruds', 'New Mycrud', 'mycruds/create');
	}
]);