"use strict";

angular.module('planz.controllers').
    controller('DisplayDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '_', '$location', 'SessionService', 'DeliveryService', 'delivery', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, _, $location, SessionService, DeliveryService, delivery, $state) {

            var currentUser = SessionService.getCurrentUser();
            $scope.delivery = delivery;
            $scope.deliveryItems = delivery.items.concat();
            $scope.deliveryCreators = _.filter(delivery.participants, function(item) {
                return item.participantType === 'creator' && item.profile.id === currentUser.id;
            });
            $scope.isDeliveryCreator = $scope.deliveryCreators.length === 1 && false === $scope.delivery.deliveryAccepted;

            /**
             * Mark the delivery as completed
             */
            $scope.completeDelivery = function() {
                console.log('DisplayDeliveryController.completeDelivery()');
                var deliveryComment = '';
                DeliveryService.completeDelivery(delivery.id, deliveryComment)
                    .then(function() {
                        console.log('DisplayDeliveryController.completeDelivery(): DONE ');
                        $scope.delivery.deliveryStatus = 'delivered';
                    });
            };

            /**
             * Modify the food donation
             *
             * @returns {*}
             */
            $scope.modifyDelivery = function() {
                console.log('DisplayDeliveryController.modifyDelivery()');
                return $state.go('my_donation_modify', {id: $scope.delivery.id});
            };

            /**
             * Mark the delivery as failed
             */
            $scope.failDelivery = function() {
                console.log('DisplayDeliveryController.failDelivery()');
                var deliveryComment = '';
                DeliveryService.failDelivery(delivery.id, deliveryComment)
                    .then(function() {
                        console.log('DisplayDeliveryController.failedDelivery(): DONE ');
                        $scope.delivery.deliveryStatus = 'failed';
                    });
            };
        }]);
