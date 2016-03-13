"use strict";

angular.module('planz.controllers').
    controller('ReviewDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location', 'ApiUrlValues', 'ProfileService', 'DeliveryService', 'delivery', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, ApiUrlValues, ProfileService, DeliveryService, delivery, $state) {

            /**
             * Stores the list of delivery items
             * @type {delivery.items|*|Array}
             */
            $scope.deliveryItems = delivery.items || [];

            /**
             * Store the details of the reviewed delivery
             */
            $scope.delivery = delivery;


            /**
             * Accept the delivery item
             *
             * @param item  the delivery item to accept
             */
            $scope.acceptItem = function (item) {
                console.log('ReviewDeliveryController.acceptItem(), item: ', item);
                item.status = 'accepted';
            };

            /**
             * Reject the delivery item
             *
             * @param item  the delivery item to reject
             */
            $scope.rejectItem = function (item) {
                console.log('ReviewDeliveryController.rejectItem(), item: ', item);
                item.status = 'rejected';
            };

            /**
             * Returns whether the delivery is valid or not
             *
             * @returns {boolean}
             */
            $scope.validateDelivery = function () {
                var deliveryItems = $scope.deliveryItems;
                var validDelivery = true;
                var totalInvalidItems = 0;

                angular.forEach(deliveryItems, function (item, index) {
                    if (item.status === 'new') {
                        validDelivery = false;
                        totalInvalidItems++;
                    }
                });

                return validDelivery;
            };

            /**
             * Save the new deliveries to the back-end
             */
            $scope.saveDelivery = function () {
                console.log('ReviewDeliveryController.saveDelivery()');
                var deliveryId = delivery.id;
                var deliveryItems = $scope.deliveryItems;

                var deliveryData = {
                    "notes": delivery.notes,
                    "items": deliveryItems
                };

                console.log('ReviewDeliveryController.saveDelivery(), validDelivery: %s, totalInvalidItems: %s, deliveryData: ', deliveryData);
                DeliveryService.reviewDelivery(deliveryId, deliveryData)
                    .then(function (data) {
                        console.log('Save successful, data: ', data);
                        $state.go('my_donations');
                    })['catch'](function (error) {
                        console.log('Error occurred while saving.');
                    });
            };

            /**
             * Cancel
             */
            $scope.cancel = function () {
                console.log('ReviewDeliveryController.cancel()');
                $state.go('my_donations');
            };
        }]);
