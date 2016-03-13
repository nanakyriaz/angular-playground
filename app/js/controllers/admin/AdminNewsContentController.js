"use strict";

angular.module('planz.controllers').
    controller('AdminNewsContentController', ['$scope', '$rootScope', '$modal', 'NewsService', 'contentItem', '$state',
        function ($scope, $rootScope, $modal, NewsService, contentItem, $state) {

            $scope.contentType = 'news story';
            $scope.contentAction = contentItem ? 'modify' : 'create';
            $scope.contentItem = contentItem;

            $scope.goBack = function() {
                $state.go('admin_news');
            };

            $scope.saveContent = function() {
                console.log('AdminNewsContentController.saveContent(), contentItem: ', $scope.contentItem);
                NewsService.createOrUpdateItem($scope.contentItem)
                    .then(function(item) {
                        console.log('Successfully created the item');
                        $state.go("admin_news_detail", {id:item.id});
                    })['catch'](function(err) {
                        console.log('Error occurred: ', err);
                    });
            };

            $scope.deleteContent = function() {
                console.log('AdminNewsContentController.deleteContent()');
                $rootScope.confirmOverlay({
                    title: "Remove this news story",
                    mainMessage: 'Are you sure you want to remove this news story?',
                    btnCancel: "Cancel",
                    btnConfirm: "Remove",
                    headerIcon: "item"
                }).then(function () {
                    NewsService.deleteItem($scope.contentItem.id)
                        .then(function (newItem) {
                            console.log('zHeroes story deleted, story: ', newItem);
                            $scope.goBack();
                        });
                });
            };
        }]);
