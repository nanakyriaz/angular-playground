"use strict";

angular.module('planz.controllers').
    controller('SuccessStoryController', ['$scope', '$rootScope', '$stateParams', '$sce', 'SuccessStoryService', 'ApiUrlValues', 'recordItem', '$state',

        function ($scope, $rootScope, $stateParams, $sce, SuccessStoryService, ApiUrlValues, recordItem, $state) {

            if (!recordItem) {
                return $state.go('not_found');
            }
            $scope.safeContent = $sce.trustAsHtml(recordItem.content);

            $scope.selectedItem = recordItem;
            $scope.htmlReady();
        }]);
