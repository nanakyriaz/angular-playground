var httpProviderIt;

describe("Error interceptor tests", function() {

    var $httpBackend;

    beforeEach(function() {
        module('planz', function ($httpProvider) {
            // save our interceptor
            httpProviderIt = $httpProvider;
            httpProviderIt.interceptors.push('ErrorInterceptor');
        });

        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
        })
    });

    it('should show that beforeEach module callback is not executed when test does not need module', function () {
        expect(true).toBeTruthy();
    });

    describe('HTTP tests', function () {

        it('should have the ErrorInterceptor as an interceptor', function () {
            expect(httpProviderIt.interceptors).toContain('ErrorInterceptor');
        });
    });

});