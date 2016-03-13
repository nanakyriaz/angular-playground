"use strict";

angular.module('planz.controllers').
    controller('DeliveryReportController', ['$scope', '$rootScope', '$stateParams', '$filter', '$q', '$location', 'SessionService', 'DeliveryService', '_', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $q, $location, SessionService, DeliveryService, _, $state) {

            var currentReport = $scope.currentReport = [];
            var lastCurrentPeriodDate;

            /**
             * Watch for changes to the current report period
             */
            $scope.$watch('currentReportPeriod', function periodChanged(newValue, oldValue) {
              if (newValue !== oldValue) {
                console.log('DeliveryReportController.currentReportPeriod() oldReportDate: %s, newReportDate %s', oldValue.reportDate, newValue.reportDate);
                $scope.getDeliveryReport();
              } else if (newValue === oldValue && !lastCurrentPeriodDate) {
                console.log('DeliveryReportController.currentReportPeriod() Same dates');
                $scope.getDeliveryReport();
              } else {
                console.log('DeliveryReportController.currentReportPeriod() oldReportDate %s, newReportDate: %s', oldValue.reportDate, newValue.reportDate);
              }
            });

            /**
             * Modify or review the delivery
             *
             * @param item  the delivery
             */
            $scope.modifyDelivery = function (item) {
                console.log('DeliveryReportController.modifyDelivery(), item: ', item);
                // check the profile type of the authenticated user: charity or business
                var currentUser = SessionService.getCurrentUser();
                if (!currentUser) {
                    return $state.go('forbidden');
                }

                //// check if the current user created the food donation
                var relevantParticipant = _.find(item.participants, function(item) {
                    return item.profile.id === currentUser.id;
                }, true);

                if (relevantParticipant && relevantParticipant.participantType === 'creator') {
                    if (item.status !== 'reviewed' && item.deliveryAccepted === false)  {
                        return $state.go('my_donation_display', {id: item.id});
                    }
                } else if (relevantParticipant && relevantParticipant.participantType === 'recipient') {
                    if (false === item.deliveryAccepted) {
                        return $state.go('my_donation_accept', {id: item.id});
                    } else if (item.status !== 'reviewed' && item.deliveryAccepted)  {
                        return $state.go('my_donation_review', {id: item.id});
                    }
                }

                return $state.go('my_donation_display', {id: item.id});
            };

            /**
             * Returns the delivery report of the active period
             */
            $scope.getDeliveryReport = function () {
                if (!$scope.currentReportPeriod) {
                    console.log('No active current report period');
                    return;
                }

                lastCurrentPeriodDate = $scope.currentReportPeriod.reportDate;
                DeliveryService.getDeliveryReport($scope.currentReportPeriod.reportDate)
                    .then(function (report) {
                        $scope.currentReport = report;
                    })
                    ['catch'](function (error) {
                        $scope.currentReport = [];
                    });
            };
        }]);
