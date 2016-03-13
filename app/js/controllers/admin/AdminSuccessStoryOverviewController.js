"use strict";

angular.module('planz.controllers').
    controller('AdminSuccessStoryOverviewController', ['$scope', '$rootScope', '$modal', 'SuccessStoryService', 'ApiUrlValues', 'recordItems', '$state',
        function ($scope, $rootScope, $modal, SuccessStoryService, ApiUrlValues, recordItems, $state) {

            /**
             * List of available of success story items
             */
            $scope.recordItems = recordItems;


            /**
             * Update the given item
             *
             * @param item  the item to update
             */
            $scope.updateItem = function (item) {
                $state.go('admin_success_story_detail', {id:item.id});
            };

            $scope.viewItem = function(item){
                $state.go('success_stories_detail', {id:item.id});
            };

            /**
             * Delete the given item
             *
             * @param item  the item to update
             */
            $scope.deleteItem = function (item) {
                console.log('AdminSuccessStoryOverviewController.deleteItem(), itemId: %s', item.id);
                $rootScope.confirmOverlay({
                    title: "Remove this zHeroes story",
                    mainMessage: 'Are you sure you want to remove this zHeroes story?',
                    btnCancel: "Cancel",
                    btnConfirm: "Remove",
                    headerIcon: "item"
                }).then(function () {
                    SuccessStoryService.deleteItem(item.id)
                        .then(function (newItem) {
                            console.log('zHeroes story deleted, story ASSOC: ', newItem);
                            $state.go("admin_success_story");
                            SuccessStoryService.getSuccessStoryList(100).then(function(data){
                                $scope.recordItems = data;
                            });
                        });
                });
            };
        }]);
