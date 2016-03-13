var httpProviderIt;

describe("SessionService tests", function() {

    var SessionService;
    var token = '1234';

    beforeEach(function() {
        module("planz");

        sessionStorage.clear();
    });

    beforeEach(inject(function (_SessionService_) {
        SessionService = _SessionService_;
    }));

    it('should show that beforeEach module callback is not executed when test does not need module', function () {
        expect(true).toBeTruthy();
    });

    it('should have SessionService be defined', function () {
        expect(SessionService).toBeDefined();
    });

    describe('Token Tests', function () {

        it('should not have token set initially', function () {
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should be null when setter is empty', function () {
            SessionService.setAuthToken();
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should be null when setter is undefined', function () {
            SessionService.setAuthToken(undefined);
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should be null when setter is null', function () {
            SessionService.setAuthToken(null);
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should be null when setter is a number', function () {
            SessionService.setAuthToken(123);
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should be null when setter is a object', function () {
            SessionService.setAuthToken({});
            expect(SessionService.getAuthToken()).toBeNull();
        });

        it('should return token when set', function () {
            SessionService.setAuthToken(token);
            expect(SessionService.getAuthToken()).toBe(token);
        });
    });

    describe('Roles Tests', function () {

        // TODO
    });

});