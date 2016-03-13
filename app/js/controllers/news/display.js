"use strict";

angular.module('planz.controllers').
    controller('NewsDisplayController', ['$scope', '$rootScope', '$stateParams', '$sce', 'NewsService', 'ApiUrlValues', 'recordItem', '$state',
        function ($scope, $rootScope, $stateParams, $sce, NewsService, ApiUrlValues, recordItem, $state) {
            if (!recordItem) {
                return $state.go('not_found');
            }

            $scope.selectedItem = recordItem;

            // img tags wont be displayed otherwise, should be safe from XSS though not sure
            $scope.explicitlyTrustedHtml = $sce.trustAsHtml(recordItem.content);

        }]);
