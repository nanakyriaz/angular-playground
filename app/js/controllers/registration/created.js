'use strict';


angular.module('planz.controllers').
    controller('RegistrationThanksController', ['$scope', '$stateParams', '$http', '$location', 'SessionService', '$state',
        function ($scope, $stateParams, $http, $location, SessionService, $state) {

            $scope.explore = function () {
                $state.go('home');
            };

        }]);
