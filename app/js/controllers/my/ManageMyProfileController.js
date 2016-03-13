"use strict";

angular.module('planz.controllers').
    controller('ManageMyProfileController', ['$scope', '$rootScope', '$stateParams', '$filter', '$upload', '$window', '$q', 'ProfileService', 'LocationService', 'userProfile', 'ApiUrlValues', '$state',

        function ($scope, $rootScope, $stateParams, $filter, $upload, $window, $q, ProfileService, LocationService, userProfile, ApiUrlValues, $state) {
            console.log('ManageMyProfileController.controller() userProfile: ', userProfile);

            var self = this;

            /**
             * Returns the text of the photo upload button
             */
            $scope.getPhotoButtonText = function () {
                if (userProfile.avatarImages) {
                    return "Change photo";
                }

                return "Add photo";
            };

            $scope.photoButtonText = $scope.getPhotoButtonText();
            $scope.selectedDonationSizes = $filter('pluck')(userProfile.donationSizes, 'id');
            $scope.selectedFoodTypes = $filter('pluck')(userProfile.foodTypes, 'id');

            $scope.profile = {
                "fullName": userProfile.fullName,
                "profileType": userProfile.profileType,
                "charityNumber": userProfile.charityNumber,
                "foodRegistrationNumber": userProfile.foodRegistrationNumber,
                "description": userProfile.description,
                "contactName": userProfile.contactName,
                "contactPhoneNumber": userProfile.contactPhoneNumber,
                "address": userProfile.address || {},
                "email": userProfile.user.email,
                "other": userProfile.other,
                "avatarImages": userProfile.avatarImages,
                "hasAvatar": angular.isObject(userProfile.avatarImages)
            };
            $scope.imageUrl = userProfile.avatarImages.full + '?' + new Date().getTime();

            if (userProfile.address) {
                $scope.profile.address1 = userProfile.address.address1;
                $scope.profile.address2 = userProfile.address.address2;
                $scope.profile.postcode = userProfile.address.postcode;
                $scope.profile.city = userProfile.address.city;
            }

            $scope.profileStatus = userProfile.status;
            //$scope.userProfile = userProfile;

            // donationSizeList list
            var donationSizeList = $scope.donationSizeList = [];
            ProfileService.getDonationSizeList().then(function (data) {
                donationSizeList.push.apply(donationSizeList, data);
            });

            // foodTypeList list
            var foodTypeList = $scope.foodTypeList = [];
            ProfileService.getFoodTypeList().then(function (data) {
                foodTypeList.push.apply(foodTypeList, data);
            });

            /**
             * Upload a message attachment
             *
             * @param files list of selected images to be uploaded
             */
            $scope.onFileSelect = function (files) {
                $scope.isUploading = false;
                console.log('ManageMyProfileController.onFileSelect()');
                if (!files) {
                    console.warn('You need to select an image before uploading.');
                    return;
                }

                $scope.photoButtonText = 'Uploading...';

                // check if only one file is selected otherwise report an error
                if (files.length > 1) {
                    console.warn('You can only upload one image');
                    return;
                }

                var uploadProgress = function uploadProgress(evt) {
                    console.log('ManageMyProfileController.onFileSelect.uploadProgress(), arguments: ', arguments);
                    var percentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.isUploading = true;
                    $scope.photoButtonText = String.format("Uploading {0}%", percentage);
                };

                var uploadError = function uploadError(data, status, headers, config) {
                    console.log('ManageMyProfileController.onFileSelect.uploadError(), arguments: ', arguments);
                    $scope.isUploading = false;
                    $scope.photoButtonText = $scope.getPhotoButtonText();
                    if(arguments[0].error!=null){
                        $window.alert(arguments[0].error);
                    }
                };

                var uploadSuccess = function uploadSuccess(data, status, headers, config) {
                    console.log('ManageMyProfileController.onFileSelect.uploadSuccess(), arguments: ', arguments);
                    $scope.isUploading = false;
                    $scope.photoButtonText = $scope.getPhotoButtonText();

                    if (data && status === 201) {
                        console.log('Adding the photo to the profile: ', data);
                        // update the current profile data
                        $scope.profile.avatar = data.avatar;
                        $scope.profile.image = data.image;
                        $scope.profile.avatarImages = {
                            "mid": data.avatarImages.mid + '?cacheBuster=' + Math.random(),
                            "full": data.avatarImages.full + '?cacheBuster=' + Math.random(),
                            "thumb": data.avatarImages.thumb + '?cacheBuster=' + Math.random()
                        };
                        $scope.imageUrl = data.avatarImages.full + '?' + new Date().getTime();
                        $scope.profile.hasAvatar = true;
                    }
                };

                var profilePhoto = files.shift();
                $scope.upload = $upload.upload({
                    url: ApiUrlValues.UploadProfilePhoto,
                    method: 'POST',
                    data: {
                        action: "updating"
                    },
                    file: profilePhoto
                }).progress(uploadProgress)
                    .success(uploadSuccess)
                    .error(uploadError);
            };

            /**
             * Validate the correctness of the profile
             * @returns {boolean}
             */
            $scope.validateProfile = function () {
                console.log('ManageMyProfileController.validateProfile() profileData: ', $scope.profile);
                return true;
            };

            /**
             * Save the profile data
             */
            $scope.saveProfile = function () {
                console.log('ManageMyProfileController.saveProfile() profileData: ', $scope.profile);
                var profileData = $scope.profile;

                if (false === $scope.validateProfile()) {
                    console.warn('ManageMyProfileController.saveProfile() Profile Data is not valid');
                    return;
                }

                // define the list of selected donation sizes and food types
                profileData.donationSizes = $scope.selectedDonationSizes;
                profileData.foodTypes = $scope.selectedFoodTypes;

                var profileGeomPoint;
                LocationService.resolveCoordinatesFromAddress(profileData.address)
                    .then(function (point) {
                        profileGeomPoint = point;
                        if (profileGeomPoint) {
                            profileData.longitude = profileGeomPoint.lng();
                            profileData.latitude = profileGeomPoint.lat();
                        }
                        console.log('Saving profile.');
                        ProfileService.updateUserProfile(profileData)
                            .then(function (profile) {
                                console.log('Successfully updated.');
                                console.log("UPDATE PROFILE" ,profile);
                                $scope.$root.$broadcast('userChanged', profile);

                                $state.go('my_profile');
                            }, function (errors) {
                                console.log('Error occurred while trying to update the profile data: ', errors);
                                $scope.processServerErrors(errors);
                            });
                    }, function(err){
                        console.log("Post code error");
                        $window.alert(err+" Please check your address and try again");
                    });
            };

            $scope.resetServerErrors = function() {
                $scope.updateForm.emailAddress.$setValidity('unique', true);
            };

            $scope.processServerErrors = function (errors) {
                console.log('ManageMyProfileController.processServerErrors() errors: ', errors);
                if (errors.error.msg === 'Email address is already taken.') {
                    // mark email as already in use
                    console.log('Mark the email address as already taken...');
                    $scope.updateForm.emailAddress.$setValidity('unique', false);
                    return;
                }
            };

            /**
             * Cancelled the editing of the profile
             */
            $scope.cancel = function () {
                console.log('ManageMyProfileController.cancel()');
                $state.go('my_profile');
            };
        }]);
