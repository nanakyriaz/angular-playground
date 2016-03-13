function LoginPage() {

    this.registrationButton = element(by.css('a[class="joinus"]'));
    this.forgotPasswordButton = element(by.css('.forgot-password'));
    this.loginButton = element(by.css('input[type=submit'));

    this.emailField = element(by.css("#emailAddress"));
    this.passwordField = element(by.css("#password"));

    this.get = function () {
        browser.get('#/login');
    };

    this.fillEmail = function(value) {
        this.emailField.sendKeys(value);
    };

    this.fillPassword = function(password) {
        if (password == null) {
            password = "password";
        }
        this.passwordField.sendKeys(password);
    };

    this.login = function() {
        this.loginButton.click();
    };

    this.registrationButtonClick = function() {
        this.registrationButton.click();
    };

    this.forgotPasswordButtonClick = function() {
        this.forgotPasswordButton.click();
    };
}

module.exports = LoginPage;