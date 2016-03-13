"use strict";

angular.module('planz.controllers').
    controller('ShareController', ['$scope', '$rootScope', '$modalInstance', '$document', '$window', 'ShareService', function ($scope, $rootScope, $modalInstance, $document, $window, ShareService) {

        $scope.title = $document[0].title;
        $scope.url = $window.location.href;

        $scope.validate = function () {
            return $scope.isEmailValid();
        };


        $scope.isEmailValid = function () {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var result = false;
            if ($scope.email) {
                var emails = $scope.email.replace(/ /g, '').split(',');
                angular.forEach(emails, function (value, key) {
                    result = re.test(value);
                    if (!result) {
                        return -1;
                    }
                });

                if (result) {
                    $scope.shareMailForm.email.$setValidity('format', true);
                } else {
                    $scope.shareMailForm.email.$setValidity('format', false);
                }
            }
            return result;
        };

        /**
         *
         */
        $scope.send = function () {
            var subject = $scope.title;
            var url = $scope.url;
            var emailAddresses = $scope.email.replace(/ /g, '').split(',');
            ShareService.shareMail(subject, url, emailAddresses, $scope.comment).then(
                function (data) {
                    $rootScope.informOverlay({
                        title: 'Page shared',
                        mainMessage: "The page has been successfully shared.",
                        headerIcon: "share"
                    });
                }, function (error) {
                    $rootScope.informOverlay({
                        title: 'Page shared',
                        mainMessage: "Something went wrong while trying to share the page.",
                        headerIcon: "share"
                    });
                }
            )['finally'](function () {
                    $modalInstance.close();
                });
        };
    }]);
