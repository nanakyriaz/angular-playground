"use strict";

angular.module('planz.controllers').
    controller('CreateDeliveryController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location',
        'ApiUrlValues', 'ProfileService', 'DeliveryService', 'unitOfMeasures',
        'volunteerProfiles', 'transporterProfiles', 'moment', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, ApiUrlValues, ProfileService, DeliveryService, unitOfMeasures, volunteerProfiles, transporterProfiles, moment, $state) {

            $scope.deliveryItems = [];
            $scope.participants = [];
            $scope.measurements = unitOfMeasures;
            $scope.delivery = {};

            $scope.favourites = [
              {
                fullName: 'Charities in my community',
                type: 'charities'
              },
              {
                fullName: 'Close to me',
                type: 'nearby'
              }
            ];


            // watch for the
            $scope.$watch('delivery.startTime', function(oldValue, newValue) {
                if (newValue !== oldValue) {
                    // only trigger when the value is different
                    var startTime = convertToDate($scope.delivery.startTime);
                    $scope.onDeliveryTimeChanged(startTime, undefined, $scope.delivery.deliveryDate);
                }
            });

            $scope.$watch('delivery.endTime', function(oldValue, newValue) {
                if (newValue !== oldValue) {
                    // only trigger when the value is different
                    var endTime = convertToDate($scope.delivery.endTime);
                    $scope.onDeliveryTimeChanged(undefined, endTime, $scope.delivery.deliveryDate);
                }
            });

            /**
             * Convert time as string into Date object
             * @param time the time in HH:MM format
             * @returns Date
             */
            function convertToDate(time) {
                if (angular.isDate(time)) {
                    return time;
                }

                return new Date("1/1/1900 " + time);
            }

            /**
             *
             * @param dateTime
             * @returns {*}
             */
            function formatTime(dateTime) {
                if (false === angular.isDate(dateTime)) {
                    return dateTime;
                }

                return dateTime.getHours().toString().lpad('0', 2) + ':' + dateTime.getMinutes().toString().lpad('0', 2);
            }

            /**
             *
             * @param dateTime
             * @returns {*}
             */
            function roundTime(dateTime) {
                var hours = dateTime.getHours(), minutes = dateTime.getMinutes();
                var m = (((minutes + 7.5) / 15 | 0) * 15) % 60;
                var h = ((((minutes / 105) + 0.5) | 0) + hours) % 24;
                dateTime.setHours(h);
                dateTime.setMinutes(m);
                return dateTime;
            }

            /**
            * Adds an empty delivery item row to the delivery items list
            */
            $scope.addNewProduct = function () {
                console.log('addNewProduct()');
                $scope.deliveryItems.push({
                    quantity: "",
                    unitOfMeasure: null,
                    productName: ""
                });
            };

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
            $scope.addNewProduct();

            /**
             *
             * @param startTime
             * @param finishTime
             * @param deliveryDate
             */
            $scope.onDeliveryTimeChanged = function (startTime, finishTime, deliveryDate) {
                console.log('CreateDeliveryController.onDeliveryTimeChanged()', startTime, finishTime);
                if (!deliveryDate) {
                    deliveryDate = new Date();
                }

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
                  if (start.getTime() <= now) {
                      startSuccess = false;
                  }
                }
                if (startSuccess && endSuccess) {
                    if (start.getTime() >= finish.getTime()) {
                        endSuccess = false;
                    }
                }

                if(startTime){
                  $scope.createDeliveryForm.from.$setValidity('invalid', startSuccess);
                }
                if(finishTime){
                  $scope.createDeliveryForm.to.$setValidity('invalid', endSuccess);
                }
            };

            /**
             * Save the new deliveries to the back-end
             */
            $scope.saveNewDeliveries = function () {
              var deliveryRecord = angular.copy($scope.delivery);
              deliveryRecord.deliveryDate = moment(deliveryRecord.deliveryDate).format('YYYY-MM-DD');
              console.log('CreateDeliveryController.saveNewDeliveries(), delivery: ', deliveryRecord);

              $scope.missingParticipants = false;

              ProfileService.resolveParticipants($scope.participants)
                  .then(function(data) {
                    if (deliveryRecord.startTime) {
                      deliveryRecord.startTime = formatTime(deliveryRecord.startTime);
                    }
                    if (deliveryRecord.endTime) {
                      deliveryRecord.endTime = formatTime(deliveryRecord.endTime);
                    }
                    deliveryRecord.participants = data;
                    deliveryRecord.items = $scope.deliveryItems;
                    return deliveryRecord;
                  })
                  .then(function(delivery) {
                    console.log('CreateDeliveryController.saveNewDeliveries(), delivery: ', delivery);
                    return DeliveryService.createDelivery(delivery);
                  })
                  .then(function(delivery) {
                    console.log('CreateDeliveryController.saveNewDeliveries(), delivery: ', delivery);
                    console.log('CreateDeliveryController.saveNewDeliveries(), navigate!');
                    $state.go('my_donations');
                  })
                  ['catch'](function(err) {
                    console.log('CreateDeliveryController.saveNewDeliveries(), Error occurred: ', err);
                    if (err.error === 'Participants are not valid') {
                      // invalid error!
                      $scope.missingParticipants = true;
                      console.log('CreateDeliveryController.saveNewDeliveries(), Forcing error');
                    } else if (err.error === 'Donation delivery date is not today or in the future.') {
                        // invalid delivery date
                        console.log('CreateDeliveryController.saveNewDeliveries(), Forcing error');
                        $scope.createDeliveryForm.date.$setValidity('date', false);
                    }
                  });
            };

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


            /*date picker*/
            $scope.today = function () {
                $scope.deliveryDate = new Date();
            };
            $scope.today();

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

            $scope.initDate = new Date();
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.shouldDateBeDisabled = function(date, mode) {
              // your own logic to determine if a date should be disabled
              var yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              yesterday.setHours(23);
              yesterday.setMinutes(59);
              if(date>yesterday)
              {
                return false;
              }
              return true;
            };

        }]);
