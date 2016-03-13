module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/js/**/*.js',
            '.tmp/vendor.js',
            'test/unit/**/*.js'
        ],

        exclude: [
            'app/js/constants_prod.js'
        ],

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-osx-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],

        // web server port
        port: 8000,

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        reporters: ['progress', 'coverage'],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // provide green / red for apps / fail.
        colors: true
    });
};
