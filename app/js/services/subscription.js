"use strict";

angular.module('planz.services').
    service('SubscriptionService', ['$rootScope', '$http', '$q', '$timeout', 'SessionService', 'ApiUrlValues', function ($rootScope, $http, $q, $timeout, SessionService, ApiUrlValues) {

        /**
         * Subscribes to newsletter
         *
         * @returns {Deferred.promise|*}
         */
        this.subscribe = function (emailAddress) {
            var deferred = $q.defer();

            $http.post(ApiUrlValues.subscribe, {"emailAddress": emailAddress})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the newsletter subscribers
         *
         * @returns {Deferred.promise|*}
         */
        this.getNewsletterSubscribers = function (limit) {
            var deferred = $q.defer();
            limit = limit || 4;

            $http.get(ApiUrlValues.NewsletterListing, {params: {"limit": limit, "sort": "createdAt DESC"}})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
        /**
         * Export the newsletter subscribers
         */
        this.exportNewsletterSubscribers = function() {
            var deferred = $q.defer();

            var token = SessionService.getAuthToken();
            if (false === token) {
                return deferred.reject();
            }

            // create hidden iframe and wait for completed event to be dispatched
            var downloadUrl = ApiUrlValues.ExportNewsletterSubcribers + '?token=' + token;
            var iframe = angular.element('<iframe>')
                .attr('src', downloadUrl)
                .attr('style', 'width: 0px; height: 0px')
                .appendTo('body').load(function () {
                    $timeout(function() {
                        console.log('exportNewsletterSubscribers(), Done!');
                        iframe.remove();
                        deferred.resolve();
                    }, 500);
                });


            return deferred.promise;
        };

    }]);
