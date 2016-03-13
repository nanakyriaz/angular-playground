"use strict";

angular.module('planz.services').
    service('ShareService', ['$rootScope', '$http', '$q', '$timeout', 'ApiUrlValues', function ($rootScope, $http, $q, $timeout, ApiUrlValues) {

        /**
         * Share via mail
         *
         * @returns {Deferred.promise|*}
         */
        this.shareMail = function (subject, url, emailAddresses, comment) {
            var deferred = $q.defer();

            var notification = {
                "subject": subject,
                "recipients": emailAddresses,
                "comment": comment,
                "url": url
            };
            console.log('ShareService.shareMail(), notification: ', notification);

            $http.post(ApiUrlValues.sharePage, notification)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);