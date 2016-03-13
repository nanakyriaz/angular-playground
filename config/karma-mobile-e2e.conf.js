exports.config = {

    // Spec patterns are relative to the location of this config.
    specs: [
        '../test/e2e/**/*.spec.js'
    ],

    // Browsers to run the end-to-end t
    multiCapabilities: [
        {
            name: 'iOS 7.1 - iPad (Landscape)',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPad Simulator',
            browserName: 'Safari',
            orientation: 'landscape'
        },
        {
            name: 'iOS 7.1 - iPad (Portrait)',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPad Simulator',
            browserName: 'Safari',
            orientation: 'portrait'
        },
        {
            name: 'iOS 7.1 - iPhone (Landscape)',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPhone Simulator',
            browserName: 'Safari',
            orientation: 'landscape'
        },
        {
            name: 'iOS 7.1 - iPhone (Portrait)',
            platformName: 'iOS',
            platformVersion: '7.1',
            deviceName: 'iPhone Simulator',
            browserName: 'Safari',
            orientation: 'portrait'
        }
    ],

    chromeOnly: false,

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:8887',

    // Selenium address
    seleniumAddress: 'http://localhost:4723/wd/hub',

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
