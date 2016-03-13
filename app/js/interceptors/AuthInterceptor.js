'use strict';

angular.module('planz.interceptors').
    factory('AuthInterceptor',
    [
        '$q', '$injector', '$rootScope', 'SessionService',
        function ($q, $injector, $rootScope, SessionService) {
            return {
                /**
                 * Interceptor method for $http requests. Main purpose of this method is to add JWT token
                 * to every request that application does.
                 *
                 * @param   {*} config
                 *
                 * @returns {*}
                 */
                request: function (config) {
                    if (config.data && false === angular.isObject(config.data)) {
                        return config;
                    }

                    var token = SessionService.getAuthToken();
                    if (false !== token && null !== token) {
                        if (!config.data) {
                            config.data = {};
                        }

                        /**
                         * Set token to actual data and headers. Note that we need bot ways because of
                         * socket cannot modify headers anyway. These values are cleaned up in backend
                         * side policy (middleware).
                         */
                        config.data.token = token;
                        config.headers.Authorization = 'Bearer ' + token;
                    } else {
                        console.warn('No authentication token available');
                    }

                    return config;
                },

                /**
                 * Interceptor method that is triggered whenever response error occurs on $http requests.
                 *
                 * @param   {*} response
                 *
                 * @returns {Promise}
                 */
                responseError: function (response) {
                    if (response.status === 401 || response.status === 403) {
                        SessionService.logout();

                        console.info('Error occurred, lets redirect to the /login page');
                        SessionService.navigateToLogin();
                    }

                    return $q.reject(response);
                }
            };
        }
    ]
);
