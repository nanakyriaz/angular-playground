"use strict";

angular.module('planz.controllers').
    controller('ProfileController', ['$scope', '$rootScope', '$stateParams', 'currentProfile', 'ProfileService', 'SessionService', '$q', '$state',

        function ($scope, $rootScope, $stateParams, currentProfile, ProfileService, SessionService, $q, $state) {

            if (!currentProfile) {
                return $state.go('not_found');
            }

            $scope.selectedItem = currentProfile;
            $scope.isLoggedIn = SessionService.getUserAuthenticated();

            /**
             * Add the given profile as friend to the list
             */
            $scope.addProfileAsFriend = function () {
                console.log('ProfileController.addProfileAsFriend()');
                var profileId = $scope.selectedItem.id;
                ProfileService.addFriendToProfile(profileId).then(function () {
                    console.log('Successfully requested to add the user as a friend...');
                    $scope.selectedItem.isFriend = true;

                    $rootScope.informOverlay({
                        title: String.format('{0} added to My Community', $scope.selectedItem.fullName),
                        headerIcon: "friend"
                    });
                })['catch'](function (error) {
                    console.log('Error: ', error);
                });
            };

            /**
             * Add the given profile as friend to the list
             */
            $scope.removeProfileAsFriend = function () {
                console.log('ProfileController.removeProfileAsFriend()');
                var profileId = $scope.selectedItem.id;
                ProfileService.removeFriendFromProfile(profileId).then(function () {
                    console.log('Successfully requested to removed the user as a friend...');
                    $scope.selectedItem.isFriend = false;

                    $rootScope.informOverlay({
                        title: String.format('{0} has been successfully removed from My Community.', $scope.selectedItem.fullName),
                        headerIcon: "friend"
                    });

                });
            };
        }]);
