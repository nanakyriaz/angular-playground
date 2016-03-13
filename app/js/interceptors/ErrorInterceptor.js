'use strict';

angular.module('planz.interceptors').
    factory('ErrorInterceptor',
    [
        '$q',
        function ($q) {
            return {

                /**
                 * Interceptor method which is triggered whenever response occurs on $http queries. Note
                 * that this has some sails.js specified hack for errors that returns HTTP 200 status.
                 *
                 * This is maybe sails.js bug, but I'm not sure of that.
                 *
                 * @param   {*} response
                 *
                 * @returns {Promise}
                 */
                response: function (response) {
                    return response || $q.when(response);
                },

                /**
                 * Interceptor method that is triggered whenever response error occurs on $http requests.
                 *
                 * @param   {*} response
                 *
                 * @returns {Promise}
                 */
                responseError: function (response) {
                    var message = '';
                    console.log('Response: ', response);

                    if (response.data && response.data.error) {
                        message = response.data.error;
                    } else if (response.data && response.data.message) {
                        message = response.data.message;
                    } else {
                        message = response.statusText + ' <span class="text-medium">(HTTP status ' + response.status + ')</span>';
                    }

                    if (message) {
                        console.warn('Error occurred while requesting data: ', message);
                    }

                    return $q.reject(response);
                }

            };
        }
    ]
);
