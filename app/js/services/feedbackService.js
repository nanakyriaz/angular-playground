"use strict";

angular.module('planz.services').
    service('FeedbackService', ['$http', '$q', 'ApiUrlValues', '$window', function ($http, $q, ApiUrlValues,$window){

        /**
         *
         * @param address
         */
        this.createFeedback = function (feedback) {
            var deferred = $q.defer();

            $http.post(ApiUrlValues.CreateFeedback, feedback)
                .success(function (data) {
                    $window.alert('Feedback sent');
                    deferred.resolve(data);
                }).error(function (error) {
                    $window.alert('Feedback submission error');
                    deferred.reject(error);
                });

            return deferred.promise;
        };

    }]);
