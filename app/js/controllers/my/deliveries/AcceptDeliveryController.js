"use strict";

angular.module('planz.controllers').
    controller('AcceptDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location', 'DeliveryService', 'ProfileService', 'delivery', 'moment', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, DeliveryService, ProfileService, delivery, moment, $state) {

            $scope.delivery = delivery;
            $scope.deliveryAccepted = delivery.deliveryAccepted ? true : false;
            $scope.processCompleted = false;
            $scope.processDeliveryAccepted = false;
            $scope.recipientCanCollect = false;
            $scope.noParticipants = false;
            $scope.donorCanDeliver = false === delivery.collectionOnly;

            $scope.deliveryItems = delivery.items.concat();
            $scope.transportationWindowIsVisible = false;
            $scope.requestWindowIsVisible = false;

            $scope.participants = [];
            $scope.favourites = [
              {
                fullName: 'Volunteers and transporters in my community',
                type: 'volunteers_transporters'
              },
              {
                fullName: 'Close to me',
                type: 'nearby'
              },
              {
                fullName: 'Public',
                type: 'public'
              }
            ];

            $scope.todayDate = function () {
                $scope.todaysDate = new Date();
            };
            $scope.todayDate();

            /**
             *
             */
            $scope.checkDonation = function() {
                console.log('AcceptDeliveryController.checkDonation()');                
                // check if the donor can deliver the food, if not show window
                
                if ($scope.delivery.collectionOnly) {
                  $scope.transportationWindowIsVisible = true;
                } else {
                  $scope.transportationWindowIsVisible = false;
                  $scope.acceptDonation();
                }
            };

            /**
             * Invoked when the recipient can collect the donation
             */
            $scope.canCollectDonation = function() {
              console.log('AcceptDeliveryController.canCollectDonation()');
              DeliveryService.acceptDelivery(delivery.id, true)
                .then(function() {
                  $scope.processDeliveryAccepted = true;
                  $scope.recipientCanCollect = true;
                  $scope.deliveryAccepted = true;
                  $scope.processCompleted = true;
                  $scope.delivery.status = 'accepted';
                });

            };

            /**
             * Accept the food donation
             */
            $scope.acceptDonation = function() {
                console.log('AcceptDeliveryController.acceptDonation()');
                DeliveryService.acceptDelivery(delivery.id, false)
                    .then(function(data) {
                        console.log('AcceptDonation(): deliveryData: ', data);
                        $scope.processDeliveryAccepted = true;
                        $scope.deliveryAccepted = true;
                        $scope.delivery.status = 'accepted';
                        console.log('AcceptDonation(): collectionOnly: ', delivery.collectionOnly);
                        if (false === delivery.collectionOnly) {
                          $scope.processCompleted = true;
                        }
                    });
            };

            /**
             * Request transportation of the food donation
             */
            $scope.requestTransportation = function() {
              $scope.requestWindowIsVisible = true;
            };

            $scope.cancelTransportation = function() {
              $scope.requestWindowIsVisible = false;
            };

            $scope.requestDelivery = function(transport) {
                console.log('RequestDelivery() deliveryId: %s transport: ', delivery.id, transport, $scope.transport);
                // request the donation delivery

                DeliveryService.requestDelivery(delivery.id, transport)
                    .then(function () {
                        $scope.deliveryAccepted = true; /* not really but for the visual aspect of things */
                        $scope.recipientCanCollect = false;
                        $scope.processCompleted = true;
                        $scope.noParticipants = false;
                    })
                    ['catch'](function(err) {
                        console.log('RequestDelivery() Error: ', err);
                        if (err.error === 'No participants') {
                            $scope.noParticipants = true;
                        }
                    });
            };

            /**
             * Loads the profiles based on the search input
             * @param query the search query
             * @returns {*}
             */
            $scope.loadProfiles = function(query) {
              return ProfileService.getProfilesByName(query, 'volunteer,transporter');
            };
        }]);
