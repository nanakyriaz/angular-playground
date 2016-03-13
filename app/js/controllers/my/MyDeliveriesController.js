"use strict";

angular.module('planz.controllers').
    controller('MyDeliveriesController', ['$scope', '$rootScope', '$stateParams', '$q', 'DeliveryService', 'ApiUrlValues', 'currentProfile', 'availableReports', '$filter', function ($scope, $rootScope, $stateParams, $q, DeliveryService, ApiUrlValues, currentProfile, availableReports, $filter) {

            /**
             * Stores for which periods reports are available
             */
            $scope.availableReports = availableReports;

            /**
             * Stores the current report period displayed on the page
             */
            setCurrentPeriod($scope.availableReports);

            /**
             * Stores the view mode of the delivery report
             */
            $scope.viewMode = 'list';

            /**
             * Stores the profile details of the authenticated user
             */
            $scope.currentProfile = currentProfile;

            /**
             * Determine the appropriate title for the page
             * @type {string}
             */
            $scope.pageTitle = "Food given";
            if (currentProfile.profileType === "charity") {
                $scope.pageTitle = "Food received/given";
            } else if ((currentProfile.profileType === "transporter") || (currentProfile.profileType === "volunteer")) {
                $scope.pageTitle = "Food transported";
            }

            function setCurrentPeriod(reports){
                //tests http://jsbin.com/jidazocedu/edit?html,js,console,output
                if (!reports || reports.length===0) {
                    return;
                }

                var currentDate = $filter('date')(new Date(), 'yyyy-MM-dd'),
                    index, current, previous, next;

                //find latest month report (closest to current month)
                for(var i=0, ii=reports.length; i<ii & !index; i+=1){
                    //check only yyyy-MM
                    if (currentDate.substring(0,7)<=reports[i].reportDate.substring(0,7)) {
                        index = i;
                    }
                }
                if (!index) {
                    index = 0;
                }
                current = reports[index];
                next = (index===0)? undefined: reports[index-1];
                previous = (index===reports.length-1)? undefined: reports[index+1];

                $scope.currentReportPeriod = current;
                $scope.prevReportPeriod = next;
                $scope.nextReportPeriod = previous;
            }
            /**
             * Switches the view mode of the page
             *
             * @param mode  the view mode (list, chart)
             */
            $scope.switchViewMode = function (mode) {
                $scope.viewMode = mode;
            };

            /**
             * Navigate to the previous available reporting period
             */
            $scope.goPreviousPeriod = function () {
                var currentIndex = $scope.availableReports.indexOf($scope.currentReportPeriod);

                currentIndex++;
                if (currentIndex < $scope.availableReports.length) {
                    var period = $scope.availableReports[currentIndex];
                    $scope.currentReportPeriod = period;

                    //
                    $scope.prevReportPeriod = $scope.availableReports[currentIndex - 1];
                    $scope.nextReportPeriod = $scope.availableReports[currentIndex + 1];
                } else {
                    console.log('Hmm');
                }
            };

            /**
             * Navigate to the next available reporting period
             */
            $scope.goNextPeriod = function () {
                var currentIndex = $scope.availableReports.indexOf($scope.currentReportPeriod);

                currentIndex--;
                if (currentIndex >= 0) {
                    $scope.currentReportPeriod = $scope.availableReports[currentIndex];

                    $scope.nextReportPeriod = $scope.availableReports[currentIndex + 1];
                    $scope.prevReportPeriod = $scope.availableReports[currentIndex - 1];
                } else {
                    console.log('Hmm');
                }
            };

            /**
             * Export a excel spreadsheet of the given reporting period
             *
             * @param period    the delivery report period
             */
            $scope.exportReport = function (period, type) {
                console.log('MyDeliveriesController.exportReport(), ', period, type);
                type = type || 'month';

                $scope.$root.loading = true;
                DeliveryService.exportReport(period, type)
                    ['catch'](function (errors) {
                        $rootScope.informOverlay({
                            title: 'Export failed',
                            mainMessage: 'Something went wrong while exporting the deliveries report.',
                            headerIcon: "export"
                        });

                        //
                    })['finally'](function () {
                        $scope.$root.loading = false;
                    });
            };

            /**
             * Export a excel spreadsheet for the given year
             * @param period
             */
            $scope.exportYearReport = function () {
                var currentYear = new Date();
                $scope.exportReport(currentYear, 'year');
            };

            /**
             *
             * @param period
             * @returns {*}
             */
            $scope.generateReportUrl = function(period) {
                return DeliveryService.getReportUrl(period, 'month');
            };

            /**
             *
             * @returns {*}
             */
            $scope.generateYearReportUrl = function() {
                var currentYear = new Date();
                return DeliveryService.getReportUrl(currentYear, 'year');
            };

        }]);
