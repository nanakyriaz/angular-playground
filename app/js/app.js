'use strict';

// Declare app level module which depends on filters, and services
//
angular.module('planz.controllers', []);
angular.module('planz.services', []);
angular.module('planz.constants', []);
angular.module('planz.interceptors', []);
angular.module('planz.directives', []);
angular.module('planz.filters', []);
angular.module('planz', [
    'ngCookies',
    'ui.router',
    'angularFileUpload',
    'ngSanitize',
    'planz.routes',
    'planz.filters',
    'planz.constants',
    'planz.services',
    'planz.directives',
    'planz.interceptors',
    'planz.controllers',
    'common.underscore',
    'common.moment',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngAnimate',
    'ui.select2',
    'ngVideo',
    'analytics',
    'angular-redactor',
    'ng',
    'seo'
]).
    config(['$translateProvider', function ($translateProvider) {
        // Adding a translation table for the English language
        $translateProvider.translations('en_GB', {
            "messages": {
                "passwordRule": "Password should be at least 6 characters and should contain one uppercase character and one number",
                "passwordsNotMatching": "Passwords don't match",
                "passwordIncorrect": "The password your entered is incorrect"
            },
            "new": "Awaiting acceptance",
            "in_review": "In Review",
            "delivered": "To be reviewed",
            "reviewed": "Reviewed",
            "rejected": "Rejected",
            "partially_rejected": "Partially rejected",
            "accepted": "Accepted",
            "shared": "Shared",
            "buttons": {
                "cancel": "Cancel",
                "close": "Close",
                "save": "Save",
                "deregister": "Deregister"
            },
            "overlays": {
                "changePassword": {
                    "title": "Change Password",
                    "labels": {
                        "currentPassword": "Current Password"
                    }
                }
            }
        });

        $translateProvider.preferredLanguage('en_GB');
    }])

    // disable trusted resources only feature of Angular.js to see if this improves the Google indexing
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
    })

    .config(['$httpProvider', function ($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache, no-store, must-revalidate';

        // Add interceptors for $httpProvider
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('ErrorInterceptor');

        //CSRF
        $httpProvider.defaults.headers.post['X-Requested-By'] = 'Plan Zheroes';
        $httpProvider.defaults.headers.put['X-Requested-By'] = 'Plan Zheroes';
        $httpProvider.defaults.headers['delete'] = $httpProvider.defaults.headers['delete'] || {};
        $httpProvider.defaults.headers['delete']['X-Requested-By'] = 'Plan Zheroes';
    }])


    .config(['$provide', function ($provide) {

        /**
         * Monkey patches the $http-service to ensure the Http Method override header parameter is being send too
         *
         * Based on: http://manikanta.com/blog/2013/07/25/decorate-angularjs-http-service-to-convert-put/
         */
        if (true === $('body').hasClass('ie')) {
            console.log('Decorating $http-service so that the requests pass the _method and X-HTTP-Method-Override-headers to the back-end...');

            /* jshint -W030 */
            $provide.decorator('$http', ['$delegate', function ($http) {
                // create function which overrides $http function
                var httpStub = function (method) {
                    return function (url, data, config) {
                        // AngularJS $http.delete takes 2nd argument as 'config' object
                        // 'data' will come as 'config.data'
                        if (method === 'delete') {
                            config = data;
                            config && (data = config.data);
                        }

                        config = config || {};
                        config.headers = config.headers || {};

                        // override actual request method with 'POST' request
                        config.method = 'POST';

                        // set the actual method in the header
                        config.headers['X-HTTP-Method-Override'] = method;

                        return $http(angular.extend(config, {
                            url: url,
                            data: data
                        }));
                    };
                };


                // backup of original methods
                $http._put = $http.put;
                $http._delete = $http['delete'];

                // override the
                $http.put = httpStub('put');
                $http['delete'] = httpStub('delete');
                return $http;
            }]);
        }

        /**
         * Injects the back-end server url in all the values of the ApiUrlValues-object
         */
        $provide.decorator('ApiUrlValues', function ($delegate, $window, $location) {

            if (!$window.serverUrl) {
                console.log('Server Url is not retrievable yet.');
                return $delegate;
            }
            else {
                var serverUrl = $window.serverUrl;
                console.log('Server Url is: ' + serverUrl);

                // Rewrite the server url to the proxying on the front-end to avoid cross-domain issues in IE9
                if ($('body').hasClass('ie')) {
                    console.log('Server Url needs to be overwritten as Internet Explorer is being used');
                    serverUrl = $window.clientUrl + "/api";
                }
            }

            var injectServerUrl = function (obj) {
                for (var item in obj) {
                    if (typeof obj[item] === 'object') {
                        injectServerUrl(obj[item]);
                    }
                    else if (typeof obj[item] === 'string') {
                        var prefix = obj[item].substring(0, 1);
                        if (prefix === '/') {
                            obj[item] = serverUrl + obj[item];
                        }
                    }
                }
            };

            injectServerUrl($delegate);
            return $delegate;
        });
    }])

    /**
     * Remove any modal dialogs when changing routes
     */
    .run(['$rootScope', '$modalStack',
        function ($rootScope, $modalStack) {
            $rootScope.$on('$locationChangeStart', function (event) {
                var top = $modalStack.getTop();
                if (top) {
                    $modalStack.dismiss(top.key);
                    event.preventDefault();
                }
            });
        }
    ]);

    /**
     * Update the document title when route changed
     */
    //.run(['$location', '$rootScope', 'SessionService', function ($location, $rootScope, SessionService) {
    //
    //    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    //        if (!current) {
    //            $rootScope.title = '';
    //            return false;
    //        }
    //
    //        if (current.$$route && current.$$route.title) {
    //            $rootScope.title = ' - ' + current.$$route.title;
    //        }
    //        else {
    //            $rootScope.title = '';
    //        }
    //    });
    //}]);
