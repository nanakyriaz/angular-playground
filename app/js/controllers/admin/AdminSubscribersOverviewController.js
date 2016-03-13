"use strict";

angular.module('planz.controllers').
    controller('AdminSubscribersOverviewController', ['$scope', '$rootScope', '$modal', 'SubscriptionService', 'ApiUrlValues', 'recordItems',
        function ($scope, $rootScope, $modal, SubscriptionService, ApiUrlValues, recordItems) {

            /**
             * List of available of news items
             */
            $scope.recordItems = recordItems;

            /**
             * Update the given item
             *
             * @param item  the item to update
             */
            $scope.exportList = function () {
                console.log('AdminSubscribersOverviewController.exportList()');

//                $scope.$root.loading = true;
                SubscriptionService.exportNewsletterSubscribers()
                    ['catch'](function (errors) {
                        $rootScope.informOverlay({
                            title: 'Export failed',
                            mainMessage: 'Something went wrong while exporting the newsletter subscribers.',
                            headerIcon: "export"
                        });
                    }).then(function () {
                        console.log('Done!');
//                        $scope.$root.loading = false;
                    });
            };
        }]);
