function HowweworkPage() {

    // callout buttons
    this.calloutBusinessButton = element(by.css('li.profile--block.business a'));
    this.calloutCharityButton = element(by.css('li.profile--block.charity a'));
    this.calloutVolunteerButton = element(by.css('li.profile--block.volunteer a'));
    this.calloutTransporterButton = element(by.css('li.profile--block.transporter a'));

    this.get = function () {
        browser.get('#/howwework');
    };

    this.getTitle = function () {
        return browser.getTitle();
    };


    // Call out
    this.calloutBusinessButtonClick = function() {
        browser.executeScript("window.scrollTo(0,document.body.scrollHeight);", "");
        this.calloutBusinessButton.click();
    };

    this.calloutCharityButtonClick = function() {
        browser.executeScript("window.scrollTo(0,document.body.scrollHeight);", "");
        this.calloutCharityButton.click();
    };

    this.calloutVolunteerButtonClick = function() {
        browser.executeScript("window.scrollTo(0,document.body.scrollHeight);", "");
        this.calloutVolunteerButton.click();
    };

    this.calloutTransporterButtonClick = function() {
        browser.executeScript("window.scrollTo(0,document.body.scrollHeight);", "");
        this.calloutTransporterButton.click();
    };
}

module.exports = HowweworkPage;