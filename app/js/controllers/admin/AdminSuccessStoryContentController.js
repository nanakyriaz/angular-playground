"use strict";

angular.module('planz.controllers').
    controller('AdminSuccessStoryContentController', ['$scope', '$rootScope', '$modal', 'SuccessStoryService', 'contentItem', '$state',
        function ($scope, $rootScope, $modal, SuccessStoryService, contentItem, $state) {

            $scope.contentType = 'success story';
            $scope.contentAction = contentItem ? 'modify' : 'create';
            $scope.contentItem = contentItem;

            $scope.goBack = function() {
                $state.go("admin_success_story");
            };

            $scope.saveContent = function() {
                console.log('AdminSuccessStoryContentController.saveContent(), contentItem: ', $scope.contentItem);
                SuccessStoryService.createOrUpdateItem($scope.contentItem)
                    .then(function(item) {
                        console.log('Successfully created the item');
                        $state.go("admin_success_story_detail", {id:item.id});
                    })['catch'](function(err) {
                        console.log('Error occurred: ', err);
                    });
            };

            $scope.deleteContent = function() {
                console.log('AdminSuccessStoryContentController.deleteContent()');
                $rootScope.confirmOverlay({
                    title: "Remove this zHeroes story",
                    mainMessage: 'Are you sure you want to remove this zHeroes story?',
                    btnCancel: "Cancel",
                    btnConfirm: "Remove",
                    headerIcon: "item"
                }).then(function () {
                    SuccessStoryService.deleteItem($scope.contentItem.id)
                        .then(function (newItem) {
                            console.log('zHeroes story deleted, story: ', newItem);
                            $scope.goBack();
                        });
                });
            };
        }]);
