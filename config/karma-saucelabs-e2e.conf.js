exports.config = {

    // Spec patterns are relative to the location of this config.
    specs: [
        '../test/e2e/**/*.spec.js'
    ],

    // Browsers to run the end-to-end t
    multiCapabilities: [
        {
            name: 'Chrome',
            browserName: 'chrome'
        },
        {
            name: 'Safari',
            browserName: 'safari'
        },
        {
            name: 'Firefox',
            browserName: 'firefox'
        },
        {
            name: 'IE 9',
            browserName: 'internet explorer',
            version: '9.0'
        },
        {
            name: 'IE 10',
            browserName: 'internet explorer',
            version: '10.0'
        },
        {
            name: 'IE 11',
            browserName: 'internet explorer',
            version: '11.0'
        },
        {
            name: 'iOS 7 - iPad',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPad Simulator',
            browserName: 'safari',
            orientation: 'landscape',
            'appium-version': '1.2.2',
            tags: ['ios']
        }
    ],

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://uat-planzheroes.keytree.net',
    sauceUser: process.env.SAUCE_USERNAME || 'weyert',
    sauceKey: process.env.SAUCE_ACCESS_KEY || 'f2b7691c-bedf-49af-8d11-6cb51453224b',

    // The timeout in milliseconds for each script run on the browser. This should
    // be longer than the maximum time your application needs to stabilize between
    // tasks.
    allScriptsTimeout: 11000,

    // How long to wait for a page to load.
    getPageTimeout: 10000,

    // Testing framework
    framework: 'jasmine',

    // Jasmine related configuration options
    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: false,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 30000
    }
};
