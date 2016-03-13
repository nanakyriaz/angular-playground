'use strict';


angular.module('planz.controllers').
    controller('ResetPasswordController', ['$scope', '$stateParams', '$http', '$location', '$window', 'LoginService', '$state', function ($scope, $stateParams, $http, $location, $window, LoginService, $state) {
        if ($stateParams) {
            $scope.email = $stateParams.email;
            $scope.token = $stateParams.token;
        }

        $scope.validate = function () {
            return $scope.isPasswordFormatOK() &&
            $scope.passwordMatches();
        };

        $scope.isPasswordFormatOK = function () {
            var re = /^(?=.{6})(?=(?:.*[A-Z]){1})(?=(?:.*\d){1})/;

            return $scope.password1 && re.test($scope.password1);
        };

        $scope.passwordMatches = function () {
            return $scope.password1 === $scope.password2;
        };

        $scope.resetPassword = function () {

            $scope.tokenError = false;

            var resetPasswordData = {
                email: $scope.email,
                password: $scope.password1,
                repeatPassword: $scope.password2,
                resetToken: $scope.token
            };

            $scope.$root.loading = true;


            LoginService.resetPassword($scope.email, resetPasswordData).then(
                function (data) {
                    $state.go('forgotten_complete');
                }, function (error) {

                    if (error.code === 'ICT-DOM-0009') {
                        $scope.tokenError = true;
                    }
                }
            )['finally'](function () {
                    $scope.$root.loading = false;
                });
        };

        $scope.cancel = function () {
            $state.go('home');
        };

        $scope.continue = function () {
            $state.go('home');
        };
    }]);
