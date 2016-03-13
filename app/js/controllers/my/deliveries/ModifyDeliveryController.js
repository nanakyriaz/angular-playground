"use strict";

angular.module('planz.controllers').
    controller('ModifyDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location',
        'ApiUrlValues', 'ProfileService', 'DeliveryService', 'unitOfMeasures', 'delivery',
        'volunteerProfiles', 'transporterProfiles', 'moment', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, ApiUrlValues, ProfileService, DeliveryService, unitOfMeasures, delivery, volunteerProfiles, transporterProfiles, moment, $state) {

            $scope.delivery = delivery;

            // only pick the recipients of the delivery (ignoring the creators)
            var recipientParticipants = [];
            angular.forEach(delivery.participants, function(item) {
                if (item.participantType === 'recipient') {
                  recipientParticipants.push(item);
                }
            });
            $scope.participants = recipientParticipants.map(function(item) {
              item.fullName = item.profile.fullName;
              return item;
            });
            $scope.deliveryItems = delivery.items.concat();
            $scope.measurements = unitOfMeasures;

            $scope.favourites = [
              {
                fullName: 'My charities',
                type: 'charities'
              },
              {
                fullName: 'Close to me',
                type: 'nearby'
              }
            ];

            /**
             * Loads the profiles based on the search input
             * @param query the search query
             * @returns {*}
             */
            $scope.loadProfiles = function(query) {
              return ProfileService.getProfilesByName(query, 'charity');
            };

            /**
             * Return the load favourites
             * @param query
             * @returns {*}
             */
            $scope.loadFavourites = function() {
              return $scope.favourites;
            };


            /**
            * Adds an empty delivery item row to the delivery items list
            */
            $scope.addNewProduct = function () {
                $scope.deliveryItems.push({
                    id: "new",
                    quantity: "",
                    unitOfMeasure: null,
                    productName: "",
                    status: "in_review"
                });
            };

            // check if the delivery items list is empty, if so add new row
            if ($scope.deliveryItems.length === 0) {
                $scope.addNewProduct();
            }


            /**
            * Removes the delivery item with the given index from the delivery
            *
            * @param index the index of the delivery item
            */
            $scope.deleteItem = function (index) {
                if (index > -1) {
                    $scope.deliveryItems.splice(index, 1);
                }
            };

            /**
             *
             * @param dateTime
             * @returns {*}
             */
            function formatTime(dateTime) {
                console.log('ModifyDeliveryController.formatTime(), time: %s', dateTime);
                if (false === angular.isDate(dateTime)) {
                    return dateTime;
                }

                return dateTime.getHours().toString().lpad('0', 2) + ':' + dateTime.getMinutes().toString().lpad('0', 2);
            }

            function getDateFromTime(timeString, sourceDate) {
                // optional handling
                if (!timeString) {
                    return undefined;
                }

                var time = timeString.split(':'),
                    date = sourceDate ? new Date(sourceDate) : new Date();

                date.setHours(+time[0]);
                date.setMinutes(time[1]);
                return date;
            }

            /**
             *
             * @param startTime
            * @param finishTime
            * @param deliveryDate
             */
            $scope.onDeliveryTimeChanged = function (startTime, finishTime, deliveryDate) {
                var endSuccess = true,
                    startSuccess = true,
                    now = new Date(),
                    start = new Date(deliveryDate),
                    finish = new Date(deliveryDate);

                if (!finishTime) {
                  endSuccess = false;
                } else {
                  finish.setHours(finishTime.getHours());
                  finish.setMinutes(finishTime.getMinutes());
                }
                if (!startTime) {
                  startSuccess = false;
                } else {
                  start.setHours(startTime.getHours());
                  start.setMinutes(startTime.getMinutes());
                }
                if (startSuccess && endSuccess) {
                    if (start.getTime() >= finish.getTime()) {
                        endSuccess = false;
                    }
                }
                if(startTime){
                  $scope.editDeliveryForm.from.$setValidity('invalid', startSuccess);
                  if (!startSuccess) {
                    $scope.editDeliveryForm.from.$dirty = true;
                  }
                }
                if(finishTime){
                  $scope.editDeliveryForm.to.$setValidity('invalid', endSuccess);
                  if (!endSuccess) {
                    $scope.editDeliveryForm.to.$dirty = true;
                  }
                }
            };


            /**
            * Save the new deliveries to the back-end
            */
            $scope.saveNewDeliveries = function () {
                console.log('saveNewDeliveries()');

                var deliveryParticipants = [];
                angular.forEach($scope.participants, function(item) {
                  //if (item.participantType === 'recipient') {
                    deliveryParticipants.push(item);
                  //}
                });
                angular.forEach($scope.delivery.participants, function(item) {
                  if (item.participantType !== 'recipient') {
                    deliveryParticipants.push(item);
                  }
                });

                //               deliveryRecord.deliveryDate = moment(deliveryRecord.deliveryDate).format('YYYY-MM-DD');

                var deliveryData = {
                    "deliveryDate": moment($scope.delivery.deliveryDate).format('YYYY-MM-DD'),
                    "participants": deliveryParticipants,
                    "items": $scope.deliveryItems
                };
                if ($scope.delivery.startTime && !isNaN( $scope.delivery.startTime.getTime() ))  {
                  deliveryData.startTime = formatTime($scope.delivery.startTime);
                }
                if (!$scope.delivery.startTime || isNaN( $scope.delivery.startTime.getTime() )) {
                    deliveryData.startTime = null;
                }

                if ($scope.delivery.endTime && !isNaN( $scope.delivery.endTime.getTime() )) {
                    deliveryData.endTime = formatTime($scope.delivery.endTime);
                }
                if (!$scope.delivery.endTime || isNaN( $scope.delivery.endTime.getTime() )) {
                    deliveryData.endTime = null;
                }

                console.log('Delivery Data: ', deliveryData);

                // submit the delivery
                DeliveryService.updateDelivery(delivery.id, deliveryData)
                    .then(function (newDelivery) {
                        console.log('Delivery updated, delivery: ', newDelivery);
                        console.log('Navigating away to /my_deliveries page');
                        $state.go('my_donations');
                    })['catch'](function (err) {
                        if (err.error === 'Participants are not valid') {
                          // invalid error!
                          $scope.missingParticipants = true;
                          console.log('ModifyDeliveryController.saveNewDeliveries(), Forcing error');
                        } else if (err.error === 'Donation delivery date is not today or in the future.') {
                            // invalid delivery date
                            console.log('ModifyDeliveryController.saveNewDeliveries(), Forcing error');
                            $scope.editDeliveryForm.date.$setValidity('date', false);
                        }
                    });
            };
            //

            /**
            * Delete the delivery for the user
            */
            $scope.removeDelivery = function () {
                var deliveryId = delivery.id;

                console.log('ModifyDeliveryController.removeDelivery(), deliveryId: ', delivery, deliveryId);
                $rootScope.confirmOverlay({
                    title: "Remove this delivery",
                    mainMessage: 'Are you sure you want to remove this Delivery?',
                    btnCancel: "Cancel",
                    btnConfirm: "Remove",
                    headerIcon: "delivery"
                }).then(function () {
                    DeliveryService.deleteDelivery(deliveryId)
                        .then(function (newDelivery) {
                            console.log('Delivery deleted, delivery: ', newDelivery);
                            $state.go('my_donations');
                        });
                });
            };

            /*date picker*/

            $scope.today = function () {
                $scope.deliveryDate = new Date();
            };
            $scope.today();

            /*time pickers*/
            $scope.delivery = $scope.delivery || {};
            $scope.delivery.startTime = getDateFromTime($scope.delivery.startTime, $scope.deliveryDate);
            $scope.delivery.endTime = getDateFromTime($scope.delivery.endTime, $scope.deliveryDate);

            $scope.clear = function () {
                $scope.deliveryDate = null;
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = $scope.delivery.deliveryDate || new Date();
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

