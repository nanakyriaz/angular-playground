function IndexPage() {

    this.signinButton = element(by.id('signin-button'));
    this.registrationButton = element(by.id('registration-button'));
    this.playButton = element(by.css('a[class="play"]'));
    this.pauseButton = element(by.css('.play.pause'));
    this.loginOverlay = element(by.css('.home-login'));

    // callout buttons
    this.calloutBusinessButton = element(by.css('li.profile--block.business a'));
    this.calloutCharityButton = element(by.css('li.profile--block.charity a'));
    this.calloutVolunteerButton = element(by.css('li.profile--block.volunteer a'));
    this.calloutTransporterButton = element(by.css('li.profile--block.transporter a'));

    this.get = function () {
        browser.get('#/');
    };

    //
    this.signButtonClick = function() {
        this.signinButton.click();
    };

    this.registrationButtonClick = function() {
        this.registrationButton.click();
    };

    this.playButtonClick = function() {
        this.playButton.click();
    };

    this.pauseButtonClick = function() {
        this.pauseButton.click();
    };

    this.getTitle = function () {
        return browser.getTitle();
    };

    // Call out
    this.calloutBusinessButtonClick = function() {
        this.calloutBusinessButton.click();
    };

    this.calloutCharityButtonClick = function() {
        this.calloutCharityButton.click();
    };

    this.calloutVolunteerButtonClick = function() {
        this.calloutVolunteerButton.click();
    };

    this.calloutTransporterButtonClick = function() {
        this.calloutTransporterButton.click();
    };
}

module.exports = IndexPage;