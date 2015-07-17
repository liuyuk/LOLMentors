'use strict';

(function() {
	// Mentors Controller Spec
	describe('Mentors Controller Tests', function() {
		// Initialize global variables
		var MentorsController,
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

			// Initialize the Mentors controller.
			MentorsController = $controller('MentorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mentor object fetched from XHR', inject(function(Mentors) {
			// Create sample Mentor using the Mentors service
			var sampleMentor = new Mentors({
				name: 'New Mentor'
			});

			// Create a sample Mentors array that includes the new Mentor
			var sampleMentors = [sampleMentor];

			// Set GET response
			$httpBackend.expectGET('mentors').respond(sampleMentors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mentors).toEqualData(sampleMentors);
		}));

		it('$scope.findOne() should create an array with one Mentor object fetched from XHR using a mentorId URL parameter', inject(function(Mentors) {
			// Define a sample Mentor object
			var sampleMentor = new Mentors({
				name: 'New Mentor'
			});

			// Set the URL parameter
			$stateParams.mentorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mentors\/([0-9a-fA-F]{24})$/).respond(sampleMentor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mentor).toEqualData(sampleMentor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mentors) {
			// Create a sample Mentor object
			var sampleMentorPostData = new Mentors({
				name: 'New Mentor'
			});

			// Create a sample Mentor response
			var sampleMentorResponse = new Mentors({
				_id: '525cf20451979dea2c000001',
				name: 'New Mentor'
			});

			// Fixture mock form input values
			scope.name = 'New Mentor';

			// Set POST response
			$httpBackend.expectPOST('mentors', sampleMentorPostData).respond(sampleMentorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mentor was created
			expect($location.path()).toBe('/mentors/' + sampleMentorResponse._id);
		}));

		it('$scope.update() should update a valid Mentor', inject(function(Mentors) {
			// Define a sample Mentor put data
			var sampleMentorPutData = new Mentors({
				_id: '525cf20451979dea2c000001',
				name: 'New Mentor'
			});

			// Mock Mentor in scope
			scope.mentor = sampleMentorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mentors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mentors/' + sampleMentorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mentorId and remove the Mentor from the scope', inject(function(Mentors) {
			// Create new Mentor object
			var sampleMentor = new Mentors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mentors array and include the Mentor
			scope.mentors = [sampleMentor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mentors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMentor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mentors.length).toBe(0);
		}));
	});
}());