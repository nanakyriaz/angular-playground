var IndexPage = require('./IndexPage');

describe('planzheroes', function() {

    describe("index", function() {

        var page = new IndexPage();

        beforeEach(function() {
            page.get();
        });

        it("should display the correct title", function() {
            expect(page.getTitle()).toBe('planZheroes');
        });

        it("should navigate to signin page after click on sign-in button", function() {
            page.signButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/login/);
        });

        it("should navigate to registration page after click on registration button", function() {
            page.registrationButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration/);
        });


        it("should display login overlay when loaded", function() {
            expect(page.loginOverlay.isDisplayed()).toBeTruthy();
        });

        it("should hide login overlay when clicking on play button", function() {
            page.playButtonClick();
            expect(page.loginOverlay.isDisplayed()).toBeFalsy();
        });

        it("should show login overlay when clicking on pause button", function() {
            page.playButtonClick();
            page.pauseButtonClick();
            expect(page.loginOverlay.isDisplayed()).toBeTruthy();
        });


        it("should navigate to registration page when clicking on business-callout button", function() {
            page.calloutBusinessButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration\/business/);
        });

        it("should navigate to registration page when clicking on charity-callout button", function() {
            page.calloutCharityButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration\/charity/);
        });

        it("should navigate to registration page when clicking on volunteer-callout button", function() {
            page.calloutVolunteerButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration\/volunteer/);
        });

        it("should navigate to registration page when clicking on transporter-callout button", function() {
            page.calloutTransporterButtonClick();
            expect(browser.getCurrentUrl()).toMatch(/\/registration\/transporter/);
        });
    });
});