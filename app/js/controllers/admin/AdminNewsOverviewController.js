"use strict";

angular.module('planz.controllers').
    controller('AdminNewsOverviewController', ['$scope', '$rootScope', '$modal', 'NewsService', 'ApiUrlValues', 'recordItems', '$state',
        function ($scope, $rootScope, $modal, NewsService, ApiUrlValues, recordItems, $state) {

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
                $state.go('admin_news_detail', {id:item.id});
            };

            $scope.viewItem = function(item){
                $state.go('news_detail', {id:item.id});
            };

            /**
             * Delete the given item
             *
             * @param item  the item to update
             */
            $scope.deleteItem = function (item) {
                console.log('AdminNewsOverviewController.deleteItem(), itemId: %s', item.id);
                $rootScope.confirmOverlay({
                    title: "Remove this news story",
                    mainMessage: 'Are you sure you want to remove this news story?',
                    btnCancel: "Cancel",
                    btnConfirm: "Remove",
                    headerIcon: "item"
                }).then(function () {
                    NewsService.deleteItem(item.id)
                        .then(function (newItem) {
                            console.log('zHeroes story deleted, story ASSOC: ', newItem);
                            $state.go("admin_news");
                            NewsService.getNewsList(100).then(function(data){
                                $scope.recordItems = data;
                            });
                        });
                });
            };
        }]);
