var httpProviderIt;

describe("Authentication interceptor tests", function() {

    var SessionService;
    var $httpBackend;
    var token = 'someToken';

    beforeEach(function() {
        module('planz', function ($httpProvider) {
            // save our interceptor
            httpProviderIt = $httpProvider;
            httpProviderIt.interceptors.push('AuthInterceptor');
        });

        inject(function ($injector) {
            SessionService = $injector.get('SessionService');
            $httpBackend = $injector.get('$httpBackend');
        })
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should show that beforeEach module callback is not executed when test does not need module', function () {
        expect(true).toBeTruthy();
    });

    it('should have SessionService be defined', function () {
        expect(SessionService).toBeDefined();
    });

    describe('HTTP tests', function () {

        it('should have the AuthInterceptor as an interceptor', function () {
            expect(httpProviderIt.interceptors).toContain('AuthInterceptor');
        });

        it('should token in the headers after setting', function() {
            $httpBackend.when('GET', 'http://example.com', null, function(headers) {
                console.log('Headers: ', headers);
                expect(headers.Authorization).toBe(token);
            }).respond(200, {name: 'example' });
        });

        it('should not place a token in the http request headers if no token is set', function() {
            SessionService.setAuthToken(undefined);
            $httpBackend.when('GET', 'http://example.com', null, function(headers) {
                console.log('Headers: ', headers);
                expect(headers.Authorization).toBe(undefined);
            }).respond(200, {name: 'example' });
        });

        it('should place a token in the http request headers after a token is set', function() {
            SessionService.setAuthToken(token);
            $httpBackend.when('GET', 'http://example.com', null, function(headers) {
                console.log('Headers: ', headers);
                expect(headers.Authorization).toBe('Bearer ' + token);
            }).respond(200, {name: 'example' });
        });
    });

});