(function () {
    'use strict';

    /**
     * ProfileModalController
     */
    angular.module('planz.controllers').
        controller('ProfileModalController', ['$rootScope', '$scope', '$timeout', '$modalInstance', 'ProfileService', 'selectedProfile', '$state', function ($rootScope, $scope, $timeout, $modalInstance, ProfileService, selectedProfile, $state) {

            $scope.selectedProfile = selectedProfile;

            /**
             * Returns the main phone number of the profile
             *
             * @param profile   the profile to be used
             * @returns {*}
             */
            $scope.phoneNumber = function (profile) {
                if (!profile) {
                    return 'N/A';
                }

                if (angular.isArray(profile.phoneNumbers)) {
                    return profile.phoneNumbers[0].phoneNumber;
                }

                return 'N/A';
            };

            /**
             * Adds the profile as friend to the authenticated user
             */
            $scope.addProfileAsFriend = function () {
                console.log('ProfileModalController.addProfileAsFriend(), selectedProfile: ', $scope.selectedProfile, ProfileService);
                ProfileService.addFriendToProfile($scope.selectedProfile.id).then(function () {
                    console.log('Successfully requested to add the user as a friend...');
                    $scope.selectedProfile.isFriend = true;

                    //$rootScope.informOverlay({
                    //    title: String.format('{0} added to My Community', $scope.selectedProfile.fullName),
                    //    headerIcon: "friend"
                    //});

                    // close the modal window?
                    //$scope.ok();
                });
            };

            /**
             * Adds the profile as friend to the authenticated user
             */
            $scope.removeProfileAsFriend = function () {
                console.log('ProfileModalController.removeProfileAsFriend(), selectedProfile: ', $scope.selectedProfile, ProfileService);
                ProfileService.removeFriendFromProfile($scope.selectedProfile.id).then(function () {
                    console.log('Successfully requested to removed the user as a friend...');
                    $scope.selectedProfile.isFriend = false;

                    //$rootScope.informOverlay({
                    //    title: String.format('{0} removed from My Community', $scope.selectedProfile.fullName),
                    //    headerIcon: "friend"
                    //});

                    // close the modal window?
                    //$scope.ok();
                });
            };

            /**
             * Navigate to the profile page with the given identifier
             *
             * @param profileId the profile identifier
             */
            $scope.openProfile = function(profileId) {
                $scope.ok();

                $timeout(function() {
                    $state.go('profile_detail', {id:profileId});
                }, 200);
            };

            /**
             * Invoked when the ok button has been clicked
             */
            $scope.ok = function () {
                $modalInstance.close();
            };

            /**
             * Invoked when the modal dialog gets dismissed
             */
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
})();
