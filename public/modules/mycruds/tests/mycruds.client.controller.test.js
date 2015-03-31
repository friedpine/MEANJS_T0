'use strict';

(function() {
	// Mycruds Controller Spec
	describe('Mycruds Controller Tests', function() {
		// Initialize global variables
		var MycrudsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Mycruds controller.
			MycrudsController = $controller('MycrudsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mycrud object fetched from XHR', inject(function(Mycruds) {
			// Create sample Mycrud using the Mycruds service
			var sampleMycrud = new Mycruds({
				name: 'New Mycrud'
			});

			// Create a sample Mycruds array that includes the new Mycrud
			var sampleMycruds = [sampleMycrud];

			// Set GET response
			$httpBackend.expectGET('mycruds').respond(sampleMycruds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mycruds).toEqualData(sampleMycruds);
		}));

		it('$scope.findOne() should create an array with one Mycrud object fetched from XHR using a mycrudId URL parameter', inject(function(Mycruds) {
			// Define a sample Mycrud object
			var sampleMycrud = new Mycruds({
				name: 'New Mycrud'
			});

			// Set the URL parameter
			$stateParams.mycrudId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mycruds\/([0-9a-fA-F]{24})$/).respond(sampleMycrud);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mycrud).toEqualData(sampleMycrud);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mycruds) {
			// Create a sample Mycrud object
			var sampleMycrudPostData = new Mycruds({
				name: 'New Mycrud'
			});

			// Create a sample Mycrud response
			var sampleMycrudResponse = new Mycruds({
				_id: '525cf20451979dea2c000001',
				name: 'New Mycrud'
			});

			// Fixture mock form input values
			scope.name = 'New Mycrud';

			// Set POST response
			$httpBackend.expectPOST('mycruds', sampleMycrudPostData).respond(sampleMycrudResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mycrud was created
			expect($location.path()).toBe('/mycruds/' + sampleMycrudResponse._id);
		}));

		it('$scope.update() should update a valid Mycrud', inject(function(Mycruds) {
			// Define a sample Mycrud put data
			var sampleMycrudPutData = new Mycruds({
				_id: '525cf20451979dea2c000001',
				name: 'New Mycrud'
			});

			// Mock Mycrud in scope
			scope.mycrud = sampleMycrudPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mycruds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mycruds/' + sampleMycrudPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mycrudId and remove the Mycrud from the scope', inject(function(Mycruds) {
			// Create new Mycrud object
			var sampleMycrud = new Mycruds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mycruds array and include the Mycrud
			scope.mycruds = [sampleMycrud];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mycruds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMycrud);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mycruds.length).toBe(0);
		}));
	});
}());