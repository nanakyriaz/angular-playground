"use strict";

angular.module('planz.controllers').
    controller('RequestDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location', 'DeliveryService', 'ProfileService', 'donation', 'deliveryRequest', 'isAcceptedDelivery',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, DeliveryService, ProfileService, donation, deliveryRequest, isAcceptedDelivery) {

            console.log('success: %s', isAcceptedDelivery);
            $scope.donation = donation;
            $scope.deliveryRequest = deliveryRequest;
            $scope.deliveryItems = donation.items.concat();
            $scope.isAcceptedDelivery = isAcceptedDelivery;
        }]);
