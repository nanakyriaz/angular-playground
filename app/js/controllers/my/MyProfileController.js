"use strict";

angular.module('planz.controllers').
    controller('MyProfileController', ['$scope', '$rootScope', '$stateParams', 'ProfileService',

        function ($scope, $rootScope, $stateParams, ProfileService) {

            $scope.selectedItem = {};
            $scope.profileStatus = {};

            setProfileDisplay();

            /**
             * Load the current authenticated user profile
             */
            function setProfileDisplay() {
                ProfileService.getUserProfile().then(function (res) {
                    console.log('MyProfileController.setProfileDisplay(), data: ', res);
                    $scope.selectedItem = res;
                    $scope.imageUrl = res.avatarImages.full + '?' + new Date().getTime();
                    $scope.profileStatus = $scope.selectedItem.status;
                });
            }
        }]);
