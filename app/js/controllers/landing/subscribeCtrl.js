"use strict";

angular.module('planz.controllers').
    controller('SubscribeController', ['$scope', '$http', 'SubscriptionService', function ($scope, $http, SubscriptionService) {

        $scope.subscribed = false;

        $scope.validate = function () {
            return $scope.isEmailValid();
        };

        $scope.isEmailValid = function () {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var result = re.test($scope.email);

            if (result) {
                $scope.subscriptionForm.email.$setValidity('format', true);
            } else {
                $scope.subscriptionForm.email.$setValidity('format', false);
            }
            return result;
        };

        $scope.subscribe = function () {


            if (!$scope.email) {
                return;
            }

            $scope.$root.loading = true;


            SubscriptionService.subscribe($scope.email).then(
                function (data) {
                    $scope.subscribed = true;
                }, function (error) {

                    if (error.code === 'ICT-DOM-0009') {
                        $scope.tokenError = true;
                    }
                }
            )['finally'](function () {
                    $scope.$root.loading = false;

                });
        };

    }]);
