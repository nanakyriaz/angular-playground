"use strict";

angular.module('planz.controllers').
    controller('NewsOverviewController', ['$scope', '$rootScope', '$stateParams', 'NewsService', 'ApiUrlValues', 'recordItems',

        function ($scope, $rootScope, $stateParams, NewsService, ApiUrlValues, recordItems) {

            $scope.recordItems = recordItems;

        }]);
