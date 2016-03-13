"use strict";

angular.module('planz.services').
    service('DeliveryService', ['$http', '$window', '$q', '$timeout', 'ApiUrlValues', 'SessionService', function ($http, $window, $q, $timeout, ApiUrlValues, SessionService) {

        /**
         * Decorates the weekly amounts with percentage and chart specifics
         *
         * @param listingItem   the list item
         */
        function decorateDeliveryStatistics(statistics) {
            // determine the highest number for all weeks
            var maxItems = 0;
            var maxBarHeight = 210;
            var weekStatistics;
            var week;
            for (week in statistics) {
                weekStatistics = statistics[week];
                maxItems = Math.max(weekStatistics, maxItems);
            }

            // calculate the appropriate percentage for each week
            for (week in statistics) {
                var total = statistics[week];
                weekStatistics = {};
                weekStatistics.total = total;
                weekStatistics.percentage = Math.ceil((total / maxItems) * 100);
                weekStatistics.barHeight = Math.ceil((maxBarHeight / 100) * weekStatistics.percentage);
                weekStatistics.highestNumberOfDeliveries = maxItems;
                statistics[week] = weekStatistics;
            }

            return statistics;
        }

        /**
         * Add a helper property to the delivery items
         * @param items
         */
        function decorateDeliveryItems(items) {
            angular.forEach(items, function(delivery) {
              delivery.items.map(function(item) {
                item.itemName =  item.quantity +  (item.unitOfMeasure ? ' ' + item.unitOfMeasure.uomDescription : '')  + ' ' + item.productName;
                return item;
              });
            });

            return items;
        }

        /**
         * Populate the delivery object with useful information
         *
         * @param delivery  the delivery
         * @returns {*}
         */
        function populateDeliveryInfo(delivery) {
          angular.forEach(delivery.participants, function(item) {
              if (item.participantType === 'creator') {
                delivery.creator = item.profile;
              }

              if (item.participantType === 'recipient' && item.accepted) {
                delivery.recipient = item.profile;
              }

              if (item.participantType === 'transporter' && item.accepted) {
                delivery.transporter = item.profile;
              }
          });

          var currentUser = SessionService.getCurrentUser();
          delivery.isShared = false;
          delivery.isTransporter = false;
          delivery.uiStatus = delivery.status;
          if (delivery.hasOwnProperty('creator') && delivery.creator) {
            delivery.isShared = delivery.creator.id === currentUser.id;
            if (delivery.isShared && delivery.status === 'new') {
              delivery.uiStatus = 'shared';
            }
          }

          if (delivery.hasOwnProperty('transporter') && delivery.transporter) {
              delivery.isTransporter = delivery.transporter.id === currentUser.id;
          }

          return delivery;
        }

        /**
         * Depopulate the unitOfMeasure field so it because the identifier instead of the entity itself
         *
         * @param item  the delivery item object
         * @returns {*}
         */
        function depopulateUnitOfMeasure(item) {
            if (item.hasOwnProperty("unitOfMeasure")) {
                item.unitOfMeasure = item.unitOfMeasure && item.unitOfMeasure.hasOwnProperty("id") ? item.unitOfMeasure.id : null;
            }

            return item;
        }

        /**
         * Returns all the deliveries
         *
         * @returns {Deferred.promise|*}
         */
        this.getAllDeliveries = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.DeliveryListing)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of deliveries and related statistics for the given period
         *
         * @param period    the year and month
         */
        this.getDeliveryReport = function (period) {
            if (!period) {
                throw new Error('No period given');
            }

            var deferred = $q.defer();
            $http.get(ApiUrlValues.DeliveryReportStatistics, {params: {period: period}})
                .success(function (data) {
                    data.byWeek = decorateDeliveryStatistics(data.byWeek);
                    data.items = data.items.map(populateDeliveryInfo);
                    data.items = decorateDeliveryItems(data.items);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };


        /**
         * Returns all the available reports for the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.getAllAvailableReportsForOwner = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.AllAvailableOwnerDeliveryReports)
                .success(function (data) {
                    data.items = decorateDeliveryItems(data.items);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns all the available reports
         *
         * @returns {Deferred.promise|*}
         */
        this.getAllAvailableReportsForRecipient = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.AllAvailableRecipientDeliveryReports)
                .success(function (data) {
                    data.items = decorateDeliveryItems(data.items);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns all the available reports for the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.getAllAvailableReportsForCollaborators = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.AllAvailableCollaboratorsDeliveryReports)
                .success(function (data) {
                    data.items = decorateDeliveryItems(data.items);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };


        /**
         * Returns the delivery with the given id
         *
         * @param deliveryId    the id of the delivery
         * @returns {Deferred.promise|*}
         */
        this.getDeliveryById = function (deliveryId, depopulate) {
            var deferred = $q.defer();
            depopulate = depopulate || false;

            $http.get(String.format(ApiUrlValues.DeliveryItem, deliveryId))
                .success(function (data) {
                    populateDeliveryInfo(data);

                    if (depopulate) {
                        data.items.map(depopulateUnitOfMeasure);
                    }
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of delivery items related to the given delivery
         * @param deliveryId    the id of the delivery
         * @returns {Deferred.promise|*}
         */
        this.getDeliveryItemsForDelivery = function (deliveryId) {
            var deferred = $q.defer();

            $http.get(String.format(ApiUrlValues.DeliveryItems, deliveryId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Create a delivery
         *
         * @param delivery the delivery details
         * @returns {Deferred.promise|*}
         */
        this.createDelivery = function (delivery) {
            var deferred = $q.defer();

            $http.post(ApiUrlValues.CreateDelivery, delivery)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Update an existing delivery
         *
         * @param deliveryId the identifier of the delivery
         * @returns {Deferred.promise|*}
         */
        this.updateDelivery = function (deliveryId, delivery) {
            var deferred = $q.defer();

            $http.put(String.format(ApiUrlValues.UpdateDelivery, deliveryId), delivery)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Delete a delivery
         *
         * @param deliveryId the identifier of the delivery
         * @returns {Deferred.promise|*}
         */
        this.deleteDelivery = function (deliveryId) {
            var deferred = $q.defer();

            $http['delete'](String.format(ApiUrlValues.DeleteDelivery, deliveryId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Complete the delivery
         *
         * @param deliveryId        the identifier of the delivery
         * @param deliveryComment   the comment
         * @returns {*}
         */
        this.completeDelivery = function(deliveryId, deliveryComment) {
            var deferred = $q.defer();

            $http.put(String.format(ApiUrlValues.CompleteDelivery, deliveryId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Accept the delivery
         *
         * @param deliveryId          the identifier of the delivery
         * @param canCollectDonation  recipient can collect the donation
         * @returns {*}
         */
        this.acceptDelivery = function(deliveryId, canCollectDonation) {
          var deferred = $q.defer();

          $http.put(String.format(ApiUrlValues.AcceptDelivery, deliveryId), {canCollectDonation:canCollectDonation})
            .success(function (data) {
              populateDeliveryInfo(data);
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        /**
         *
         * @param deliveryId
         * @param transport
         * @returns {*}
         */
        this.requestDelivery = function(deliveryId, transport) {
            // CreateDeliveryRequest
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.CreateDeliveryRequest, deliveryId), transport).success(function (data) {
                deferred.resolve(data);
              }).error(function (error) {
                deferred.reject(error);
              });

            return deferred.promise;
        };

        /**
         *
         * @param deliveryId
         * @param transport
         * @returns {*}
         */
        this.acceptDeliveryRequest = function(deliveryId, transport) {
          // AcceptDeliveryRequest
          var deferred = $q.defer();

          $http.post(String.format(ApiUrlValues.AcceptDeliveryRequest, deliveryId), transport)
            .success(function (data) {
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };


        this.getDeliveryRequestByDonation = function(donationId) {
          var deferred = $q.defer();

          $http.get(String.format(ApiUrlValues.DeliveryRequests, donationId))
            .success(function (data) {
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        /**
         *
         * @param deliveryId
         * @param transport
         * @returns {*}
         */
        this.acceptDeliveryRequest = function(deliveryId, transport) {
          var deferred = $q.defer();

          $http.put(String.format(ApiUrlValues.AcceptDeliveryRequest, deliveryId), transport)
            .success(function (data) {
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        /**
         * Mark the delivery as failed
         *
         * @param deliveryId        the identifier of the delivery
         * @param deliveryComment   the comment
         * @returns {*}
         */
        this.failDelivery = function(deliveryId, deliveryComment) {
            var deferred = $q.defer();

            $http.put(String.format(ApiUrlValues.FailedDelivery, deliveryId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Create a delivery item for an existing delivery
         *
         * @param deliveryId    the id of the delivery
         * @param deliveryItem  the delivery item data
         * @returns {Deferred.promise|*}
         */
        this.addDeliveryItem = function (deliveryId, deliveryItem) {
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.CreateDeliveryItem, deliveryItem), deliveryItem)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Store the reviewed delivery
         *
         * @param deliveryId    the identifier of the delivery
         * @param deliveryData  the reviewed delivery data
         * @returns {Deferred.promise|*}
         */
        this.reviewDelivery = function (deliveryId, deliveryData) {
            var deferred = $q.defer();
            $http.put(String.format(ApiUrlValues.ReviewDelivery, deliveryId), deliveryData)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Update the status of an existing delivery item
         *
         * @param deliveryItemId    the id of the delivery item
         * @param deliveryId        the id of the related delivery
         * @param status            the status
         * @returns {Deferred.promise|*}
         */
        this.updateDeliveryItemStatus = function (deliveryItemId, deliveryId, status) {
            var deliveryItem = {
                status: status
            };

            var deferred = $q.defer();
            $http.put(String.format(ApiUrlValues.UpdateDeliveryItem, deliveryId, deliveryItemId), deliveryItem)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the url for the given reporting period
         *
         * @param period    the period of the report
         * @param type      the type of the report
         */
        this.getReportUrl = function(period, type) {
            type = type || 'month';

            var token = SessionService.getAuthToken();
            if (false === token) {
                return false;
            }

            return ApiUrlValues.ExportDeliveryReportStatistics + '?period=' + period + '&type=' + type + '&token=' + token;
        };

        /**
         * Export the deliveries for the given period
         *
         * @param period    the period
         * @param type      the type of report (year, month, quarter)
         */
        this.exportReport = function (period, type) {
            type = type || 'month';

            var deferred = $q.defer();

            var token = SessionService.getAuthToken();
            if (false === token) {
                return deferred.reject();
            }

            // create hidden iframe and wait for completed event to be dispatched
            var downloadUrl = this.getReportUrl(period, type);
            var iframe = angular.element('<iframe>')
                .attr('src', downloadUrl)
                .attr('style', 'width: 0px; height: 0px')
                .appendTo('body').load(function () {
                    $timeout(function() {
                        iframe.remove();
                        deferred.resolve();
                    }, 500);
                });


            return deferred.promise;
        };

        /**
         * Returns the list of available unit of measures
         * @returns {Deferred.promise|*}
         */
        this.getUnitOfMeasures = function () {
            var deferred = $q.defer();
            $http.get(ApiUrlValues.UnitOfMeasures)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
