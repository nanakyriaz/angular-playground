"use strict";

angular.module('planz.controllers').
    controller('AdminProfileOverviewController', ['$scope', '$rootScope', '$modal', 'ProfileService', 'ApiUrlValues', 'unapprovedItems', 'approvedItems',
        function ($scope, $rootScope, $modal, ProfileService, ApiUrlValues, unapprovedItems, approvedItems) {

            /**
             * List of unapproved profiles
             */
            $scope.unapprovedProfiles = unapprovedItems;
            $scope.approvedProfiles = approvedItems;

            $scope.tab = 'approved';

            $scope.selectedApprovedProfiles = [];
            $scope.selectedUnapprovedProfiles = [];

            $scope.toggleSelectAll = function toggleSelectAll(selected, all) {
                var allSelected = selected.length === all.length;
                if (allSelected) {
                    selected.splice(0, selected.length);
                } else {
                    selected = all.slice(0);
                }
                return selected;
            };

            /**
             * Show the profile details in a modal
             *
             * @param profile
             */
            $scope.viewProfile = function viewProfile(profile) {
                console.log('AdminProfileOverviewController.viewProfile(), profileId: %s', profile.id);
                var popupModuleInstance = $modal.open({
                    templateUrl: 'js/views/administration/profiles/viewProfilePopup.html',
                    controller: 'ProfileModalController',
                    resolve: {
                        selectedProfile: function () {
                            return profile;
                        }
                    }
                });
                popupModuleInstance.result.then(function () {
                    console.log('State 1');
                }, function () {
                    console.log('State 2');
                });
            };

            /**
             * Approve the profile with the given profile id
             *
             * @param profile
             */
            $scope.approveProfile = function (profile) {
                console.log('AdminProfileOverviewController.approveProfile(), profileId: %s', profile.id);
                ProfileService.approveProfileById(profile.id)
                    .then(function () {
                        console.log('Done!');
                        profile.approvedProfile = true;
                    });
            };

            $scope.unapproveProfiles = function unapproveProfiles(profiles) {
                if (!profiles.length) {
                    return;
                }
                console.log('AdminProfileOverviewController.unapproveProfiles(), profiles: %s', profiles);
                $rootScope.confirmOverlay({
                    title: 'Unapprove profiles',
                    mainMessage: 'Are you sure you want to unapprove the ' + profiles.length + ' selected profiles?',
                    btnCancel: 'Cancel',
                    btnConfirm: 'Unapprove',
                    headerIcon: 'item'
                }).then(function () {
                    ProfileService.unapproveProfiles(profiles)
                        .then(function () {
                            console.log('Done!');
                            for (var i = 0, c = profiles.length; i < c; i++) {
                                profiles[i].approvedProfile = false;
                            }
                        });
                });
            };

            /**
             * Unapprove the profile with the given profile id
             *
             * @param profile
             */
            $scope.unapproveProfile = function (profile) {
                console.log('AdminProfileOverviewController.unapproveProfile(), profileId: %s', profile.id);
                $rootScope.confirmOverlay({
                    title: 'Unapprove profile',
                    mainMessage: 'Are you sure you want to unapprove this profile?',
                    btnCancel: 'Cancel',
                    btnConfirm: 'Unapprove',
                    headerIcon: 'item'
                }).then(function () {
                    ProfileService.unapproveProfileById(profile.id)
                        .then(function () {
                            console.log('Done!');
                            profile.approvedProfile = false;
                        });
                });
            };
            /**
             * Deactivate the profile with the given profile id
             *
             * @param profile
             * @param list
             */
            $scope.deactivateProfile = function deactivateProfile(profile, list) {
                console.log('AdminProfileOverviewController.deactivateProfile(), profileId: %s', profile.id);

                $rootScope.confirmOverlay({
                    title: 'Delete profile',
                    mainMessage: 'Are you sure you want to delete this profile?',
                    btnCancel: 'Cancel',
                    btnConfirm: 'Delete',
                    headerIcon: 'item'
                }).then(function () {
                    ProfileService.deactivateProfileById(profile.id)
                        .then(function () {
                            console.log('Done!');
                            removeProfile(profile, list);
                        });
                });
            };
            $scope.deactivateProfiles = function deactivateProfiles(profiles, list) {
                if (!profiles.length) {
                    return;
                }
                console.log('AdminProfileOverviewController.deactivateProfiles(), profiles: %s', profiles);
                $rootScope.confirmOverlay({
                    title: 'Delete profiles',
                    mainMessage: 'Are you sure you want to delete the ' + profiles.length + ' selected profiles?',
                    btnCancel: 'Cancel',
                    btnConfirm: 'Delete',
                    headerIcon: 'item'
                }).then(function () {
                    ProfileService.deactivateProfiles(profiles)
                        .then(function () {
                            console.log('Done!');
                            for (var i = 0, c = profiles.length; i < c; i++) {
                                removeProfile(profiles[i], list);
                            }
                        });
                });
            };

            function removeProfile(profile, list) {
                var profileIndex = list.indexOf(profile);
                if (profileIndex > -1) {
                    list.splice(profileIndex, 1);
                }
            }

            $scope.exportList = function (approved) {
                console.log('AdminProfileOverviewController.exportList()', approved);

//                $scope.$root.loading = true;
                ProfileService.exportProfiles(approved)
                    ['catch'](function (errors) {
                        $rootScope.informOverlay({
                            title: 'Export failed',
                            mainMessage: 'Something went wrong while exporting the newsletter subscribers.',
                            headerIcon: "export"
                        });
                    }).then(function () {
                        console.log('Done!');
//                        $scope.$root.loading = false;
                    });
            };
        }]);
