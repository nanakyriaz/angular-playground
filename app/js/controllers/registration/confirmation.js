'use strict';


angular.module('planz.controllers').
    controller('RegistrationConfirmationController', ['$scope', '$stateParams', '$http', '$location', 'status', '$state',
        function ($scope, $stateParams, $http, $location, status, $state) {

            $scope.explore = function () {
                $state.go('map');
            };

            console.log('RegistrationConfirmationController.execute() status: ', status);

            var successful;
            if (false === status.hasOwnProperty("error")) {
                successful = true;
                $scope.profileType = status.profileType;
            } else {
                successful = false;
                $scope.errorReason = status.error;
            }

            $scope.confirmationStatus = successful;
            console.log('RegistrationConfirmationController.execute() confirmationStatus: ', $scope.confirmationStatus);
        }]);
