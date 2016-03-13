'use strict';


angular.module('planz.controllers').
    controller('ConfirmationController', ['$scope', '$stateParams', '$http', '$location', '$window', 'LoginService', '$state', function ($scope, $stateParams, $http, $location, $window, LoginService, $state) {

        $scope.validateEmail = false;

        $scope.isEmailValid = function () {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test($scope.email);
        };

        $scope.requestPasswordReset = function () {
            if (!$scope.email) {
                return;
            }
            $scope.userNotFound = false;

            $scope.$root.loading = true;

            LoginService.requestConfirmReset($scope.email).then(
                function (data) {
                    $scope.$root.loading = false;
                    console.log('success, reset email sent');

                    $state.go('email_confirm_confirmation');
                }, function (error) {
                    console.log('Error: ', error);
                    if (error.error.indexOf('not found') > -1) {
                        $scope.userNotFound = true;
                    }

                    $scope.$root.loading = false;
                }
            );
        };

        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.validate = function () {
            return $scope.isEmailValid();
        };
    }]);
