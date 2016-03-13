"use strict";

angular.module('planz.controllers').
    controller('MySettingsController', ['$scope', '$rootScope', '$state', '$stateParams', 'ProfileService',
        'ApiUrlValues', '$q', 'previousState',

        function ($scope, $rootScope,  $state, $stateParams, ProfileService, ApiUrlValues, $q, previousState) {


            $scope.activeSection = 'privacy';
            $scope.currentSettings = {};
            $scope.userSettings = {};

            $scope.cancel = function() {
                $state.go(previousState.name);
            };

            /**
             * Retrieve the user settings
             */
            ProfileService.getUserSettings().then(function (settings) {
                $scope.currentSettings = settings;
                $scope.userSettings = settings;
            });

            /**
             * Update the notification profile settings
             */
            $scope.sendNotifications = function () {
                console.log('MySettingsController.sendNotifications()');

                // check the digest user settings
                if ($scope.userSettings.digest_frequency === 'never') {
                    $scope.userSettings.digest = false;
                } else {
                    $scope.userSettings.digest = true;
                }

                // compile the notification settings
                var notificationSettings = {
                    "messaging": $scope.userSettings.messaging,
                    "deliveries_statuses": $scope.userSettings.deliveries_statuses,
                    "friend_suggestions": $scope.userSettings.friend_suggestions,
                    "newsletter": $scope.userSettings.newsletter,
                    "mail_notifications": $scope.userSettings.mail_notifications,
                    "digest": $scope.userSettings.digest,
                    "digest_frequency": $scope.userSettings.digest_frequency
                };

                console.log('MySettingsController.sendNotifications(), notificationSettings: ', notificationSettings);

                // update the profile settings of the user
                $scope.$root.loading = true;
                $scope.notificationsSaved = false;
                ProfileService.updateUserSettings(notificationSettings)
                    .then(function () {
                        console.log('Successfully updated the settings!');
                        $scope.notificationsSaved = true;
                    })['catch'](function () {
                        $scope.notificationsSaved = false;
                    })['finally'](function () {
                        $scope.$root.loading = false;
                    });
            };

            /**
             * Update the profile privacy settings
             */
            $scope.sendPrivacy = function () {
                console.log('MySettingsController.sendPrivacy()');

                if ($scope.privacyForm.location && $scope.privacyForm.contact) {

                    $scope.$root.loading = true;
                    $scope.privacySaved = false;
                    ProfileService.updateUserSettings({
                        location_visibility: $scope.userSettings.location_visibility,
                        contact_visibility: $scope.userSettings.contact_visibility
                    }).then(
                        function () {
                            console.log('Successfully updated the settings!');
                            $scope.privacySaved = true;
                        },
                        function () {
                            $scope.privacySaved = false;
                        }
                    )['finally'](function () {
                            $scope.$root.loading = false;
                        });

                }
            };


            /**
             *
             * @returns {boolean}
             */
            $scope.passwordMatches = function () {
                var result = $scope.newPassword === $scope.repeatPassword;
                if (result) {
                    $scope.passwordForm.$setValidity('repeatPassword', true);
                    $scope.passwordForm.repeatPassword.$setValidity('format', true);
                } else {
                    $scope.passwordForm.$setValidity('repeatPassword', false);
                    $scope.passwordForm.repeatPassword.$setValidity('format', false);
                }
                return result;
            };

            /**
             * Update the password of the user
             */
            $scope.sendPassword = function () {
                console.log('MySettingsController.sendPassword()');
                $scope.passwordSaved = false;

                if ($scope.newPassword === $scope.repeatPassword && $scope.currentPassword) {
                    console.log('MySettingsController.sendPassword(): Password have been given. Try to process the changes');

                    $scope.$root.loading = true;
                    ProfileService.updatePasswordSettings({
                        current_password: $scope.currentPassword,
                        password: $scope.newPassword,
                        confirm_password: $scope.repeatPassword
                    }).then(function () {
                        console.log('Successfully updated the settings!');
                        $scope.passwordSaved = true;
                    })['catch'](function (response) {
                        console.log('Error occurred while trying to update the password for the user, response: ', response);
                        switch (response.error) {
                            case 'Error.Passport.CurrentPassword.Missing':
                                $scope.passwordForm.currentPassword.$setValidity('required', false);
                                break;
                            case 'Error.Passport.Password.Required':
                                $scope.passwordForm.newPassword.$setValidity('required', false);
                                break;
                            case 'Error.Passport.Password.Wrong':
                                $scope.passwordForm.currentPassword.$setValidity('incorrect', false);
                                break;
                            case 'Error.Passport.Password.MinLengthError':
                                $scope.passwordForm.newPassword.$setValidity('pattern', false);
                                break;
                            case 'Error.Passport.Password.PatternError':
                                $scope.passwordForm.newPassword.$setValidity('pattern', false);
                                break;
                            case 'Error.Passport.RepeatPassword.Required':
                                $scope.passwordForm.repeatNewPassword.$setValidity('required', false);
                                break;
                        }

                        $scope.passwordSaved = false;
                    })['finally'](function () {
                        $scope.$root.loading = false;
                    });
                }
            };
        }]);
