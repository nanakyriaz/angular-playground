"use strict";

angular.module('planz.controllers').
    controller('MessagingController', ['$scope', '$rootScope', '$stateParams', 'MessagingService', 'ApiUrlValues', '$q',

        function ($scope, $rootScope, $stateParams, MessagingService, ApiUrlValues, $q) {

            /**
             * Returns the list of messages for the authenticated user
             */
            $scope.$root.loading = true;
            var messagesId = $stateParams.message_id ? $stateParams.message_id : undefined;
            MessagingService.getMessagesList(messagesId).then(function (res) {
                $scope.conversationItems = res;
                $scope.$root.loading = false;
            });
        }]);
