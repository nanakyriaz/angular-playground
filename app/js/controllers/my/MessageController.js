"use strict";

angular.module('planz.controllers').
    controller('MessageController', ['$scope', '$rootScope', '$stateParams', '$location', 'MessagingService', 'ProfileService', '$q', '$state',

        function ($scope, $rootScope, $stateParams, $location, MessagingService, ProfileService, $q, $state) {

            // do stuff for filtering...
            $scope.maximumMessageLength = 400;
            $scope.availableCharacters = $scope.maximumMessageLength;
            $scope.recipients = [];
            $scope.validMessage = false;

            // the list of convenient favourites for the user
            $scope.favourites = [
                {
                    fullName: 'My community',
                    type: 'community'
                },
                {
                    fullName: 'Close to me',
                    type: 'nearby'
                }
                // {
                //     fullName: 'Public',
                //     type: 'public'
                // }
            ];

            /**
             * Loads the profiles based on the search input
             * @param query the search query
             * @returns {*}
             */
            $scope.loadProfiles = function(query) {
                return ProfileService.getProfilesByName(query);
            };

            /**
             * Send the message to the back-end
             */
            $scope.sendMessage = function () {
                var message = $scope.message,
                    recipients = $scope.recipients;

                $scope.errorMessage = false;
                $scope.validMessage = false;
                MessagingService.sendMessage(message, recipients).then(function (data) {
                    $scope.validMessage = true;

                    // redirect to the message centre
                    $state.go('my_messages');
                })['catch'](function (error) {
                    $scope.validMessage = true;
                    if (error.hasOwnProperty("error")) {
                        $scope.errorMessage = error.error;
                    } else {
                        $scope.errorMessage = "Unexpected error occurred while sending message.";
                    }
                });
            };

            /**
             * Refresh the message visual element
             */
            $scope.refreshMessage = function () {
                var messageLength = $scope.message ? $scope.message.length : $scope.maximumMessageLength;
                $scope.availableCharacters = $scope.maximumMessageLength - messageLength;
                $scope.validateMessage();
            };

            /**
             * Validates the message to meet the requirements
             *
             * @returns {boolean}
             */
            $scope.validateMessage = function () {
                var result = !!$scope.message;
                if ($scope.availableCharacters < 0) {
                    result = false;
                }

                if (result) {
                    $scope.messageForm.message.$setValidity('required', true);
                } else {
                    $scope.messageForm.message.$setValidity('required', false);
                }

                $scope.validMessage = result;
                return result;
            };
        }]);
