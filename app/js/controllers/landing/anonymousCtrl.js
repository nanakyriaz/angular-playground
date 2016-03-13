"use strict";

angular.module('planz.controllers').
    controller('AnonymousController', ['$scope', '$http', 'SuccessStoryService', 'SubscriptionService', 'video', function ($scope, $http, SuccessStoryService, SubscriptionService, video) {
        var successStories = $scope.successStories = [];
        var iOSLoaded = false;
        $scope.subscribed = false;

        (function () {
            //load video
            var source = video.multiSource();
            source.addSource('webm', '/media/videos/planz-landing.webm');
            source.addSource('mp4', '/media/videos/planz-landing.mp4');
            source.save();
            // retrieve the list of success stories to be shown on the page
            SuccessStoryService.getSuccessStoryFrontList().then(function (res) {
                for (var i in res) {
                    successStories.push(res[i]);
                }
            });
        })();

        $scope.validate = function () {
            return $scope.isEmailValid();
        };

        $scope.isEmailValid = function () {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var result = re.test($scope.email);

            if (result) {
                $scope.subscriptionForm.email.$setValidity('format', true);
            } else {
                $scope.subscriptionForm.email.$setValidity('format', false);
            }
            return result;
        };

        $scope.subscribe = function () {
            if (!$scope.email) {
                return;
            }
            $scope.$root.loading = true;


            SubscriptionService.subscribe($scope.email).then(
                function (data) {
                    $scope.subscribed = true;
                }, function (error) {

                    if (error.code === 'ICT-DOM-0009') {
                        $scope.tokenError = true;
                    }
                }
            )['finally'](function () {
                    $scope.$root.loading = false;

                });
        };

    }]);
