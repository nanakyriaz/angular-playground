var LoginPage = require('./LoginPage');

describe('planzheroes', function() {

    describe("login", function() {

        var page = new LoginPage();

        beforeEach(function() {
            page.get();
        });

        it("should navigate to registration page after click on registration button", function() {
            page.registrationButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration/);
        });

        it("should navigate to forgot password page after click on forgot-password button", function() {
            page.forgotPasswordButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/forgotten/);
        });

        it("should display error when empty email address is entered", function() {
            page.fillEmail('');
        });
    });
});