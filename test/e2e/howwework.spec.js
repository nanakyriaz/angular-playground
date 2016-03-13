var HowweworkPage = require('./howweworkPage');

describe('planzheroes', function() {

    describe("howwework", function() {

        var page = new HowweworkPage();

        beforeEach(function() {
            page.get();
            browser.sleep(2000);
        });

        it("should display the correct title", function() {
            expect(page.getTitle()).toBe('planZheroes - How We Work');
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