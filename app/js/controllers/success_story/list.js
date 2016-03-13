"use strict";

angular.module('planz.controllers').
    controller('SuccessStoryOverviewController', ['$scope', '$rootScope', '$stateParams', 'SuccessStoryService', 'ApiUrlValues', 'recordItems',

        function ($scope, $rootScope, $stateParams, SuccessStoryService, ApiUrlValues, recordItems) {

            $scope.recordItems = recordItems;
            $scope.htmlReady();
        }]);
