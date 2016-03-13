'use strict';


angular.module('planz.controllers').
    controller('RegistrationController', ['$scope', '$rootScope', '$stateParams', '$http', '$location', '$modal', 'AddressService', 'RegistrationService', 'LoginService', 'SessionService', 'LocationService', 'ProfileService', '$window', '$state',
        function ($scope, $rootScope, $stateParams, $http, $location, $modal, AddressService, RegistrationService, LoginService, SessionService, LocationService, ProfileService, $window, $state) {

            $scope.validations = {
                Email: false,
                ProfileType: false
            };

            $scope.profileType = '';
            if ($stateParams.group) {
                console.log('Registration Profile Type: ', $stateParams);
                $scope.profileType = $stateParams.group;
            }

            // donationSizeList list
            var donationSizeList = $scope.donationSizeList = [];
            ProfileService.getDonationSizeList().then(function (data) {
                donationSizeList.push.apply(donationSizeList, data);
            });

            // collectionTimeList list
            var collectionTimeList = $scope.collectionTimeList = [];
            ProfileService.getCollectionTimeList().then(function (data) {
                collectionTimeList.push.apply(collectionTimeList, data);
            });


            //TODO: should use a modal
            $scope.cancel = function (part) {
                var message = "The registration information will not be saved. Do you wish to continue?";

                if ($window.confirm(message)) {
                    $state.go('home');
                }
            };

            /**
             * Display the account information popup window
             */
            $scope.displayAccountInfoPopup = function () {
                console.log('RegistrationController.displayAccountInfoPopup()');
                $rootScope.modalInstance = $modal.open({
                    templateUrl: 'js/views/overlays/profileTypes.html',
                    windowClass: 'standard-window',
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };
                    }
                });
            };


            //VALIDATION METHODS

            $scope.validate = function () {
                return $scope.isEmailValid() &&
                $scope.registerForm.password.$valid &&
                $scope.passwordMatches();
            };

            $scope.isProfileTypeValid = function () {
                var result = $scope.profileType !== '';
                if (result) {
                    $scope.registerForm.profileType.$setValidity('format', true);
                } else {
                    $scope.registerForm.profileType.$setValidity('format', false);
                }

                return result;
            };

            $scope.isEmailValid = function () {
                if (!$scope.validations.Email) {
                    return true;
                }
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var result = re.test($scope.email);

                if (result) {
                    $scope.registerForm.email.$setValidity('format', true);
                } else {
                    $scope.registerForm.email.$setValidity('format', false);
                }


                return result;
            };

            $scope.passwordMatches = function () {
                var result = $scope.password1 === $scope.password2;
                if (result) {
                    $scope.registerForm.$setValidity('repeatPassword', true);
                    $scope.registerForm.repeatPassword.$setValidity('format', true);
                } else {
                    $scope.registerForm.$setValidity('repeatPassword', false);
                    $scope.registerForm.repeatPassword.$setValidity('format', false);
                }
                return result;
            };

            $scope.firstPasswordMatches = function(){
                if($scope.password2!=null && $scope.password2.length>0){
                    $scope.passwordMatches();
                }else{
                    $scope.registerForm.$setValidity('repeatPassword', false);
                }
            };

            /**
             *
             * @returns {boolean}
             */
            $scope.isPostCodeCorrect = function () {
                var validPostcode = AddressService.validatePostcode($scope.postCode);
                if (validPostcode) {
                    $scope.registerForm.postCode.$setValidity('postCode', true);
                    return true;
                }

                $scope.registerForm.postCode.$setValidity('postCode', false);
                return null;
            };

            $scope.fullNameValid = function () {
                var result = !!$scope.fullName;

                if (result) {
                    $scope.registerForm.fullName.$setValidity('required', true);
                } else {
                    $scope.registerForm.fullName.$setValidity('required', false);
                }
                return result;
            };

            $scope.charityNameValid = function () {
                var result = !!$scope.charityName;

                if (result) {
                    $scope.registerForm.charityName.$setValidity('required', true);
                } else {
                    $scope.registerForm.charityName.$setValidity('required', false);
                }
                return result;
            };

            $scope.businessNameValid = function () {
                var result = !!$scope.businessName;

                if (result) {
                    $scope.registerForm.businessName.$setValidity('required', true);
                } else {
                    $scope.registerForm.businessName.$setValidity('required', false);
                }
                return result;
            };

            $scope.charityNumberValid = function () {
                var result = !!$scope.charityNumber;

                if (result) {
                    $scope.registerForm.charityNumber.$setValidity('required', true);
                } else {
                    $scope.registerForm.charityNumber.$setValidity('required', false);
                }
                return result;
            };

            $scope.phoneNumberValid = function () {
                var uk_number_regex = /^[0-9+ #]*$/;
                var portugal_number_regex = /^(9|2{1})+([1-9]{1})+([0-9]{7})$/;
                var result = false;
                if (uk_number_regex.test($scope.phoneNumber)) {
                    result = true;
                    $scope.registerForm.phoneNumber.$setValidity('required', true);
                } else if (portugal_number_regex.test($scope.phoneNumber)) {
                    result = true;
                    $scope.registerForm.phoneNumber.$setValidity('required', true);
                } else {
                    result = false;
                    $scope.registerForm.phoneNumber.$setValidity('required', false);
                }
                return result;
            };

            $scope.transportationModeValid = function () {
                var result = !!$scope.transportationMode;

                if (result) {
                    $scope.registerForm.transportationMode.$setValidity('required', true);
                } else {
                    $scope.registerForm.transportationMode.$setValidity('required', false);
                }
                return result;
            };

            $scope.collectionTimeValid = function () {
                var result = !!$scope.collectionTime;

                if (result) {
                    $scope.registerForm.collectionTime.$setValidity('required', true);
                } else {
                    $scope.registerForm.collectionTime.$setValidity('required', false);
                }
                return result;
            };

            $scope.donationFrequencyValid = function () {
                var result = !!$scope.donationFrequency;

                if (result) {
                    $scope.registerForm.donationFrequency.$setValidity('required', true);
                } else {
                    $scope.registerForm.donationFrequency.$setValidity('required', false);
                }
                return result;
            };

            $scope.charityBeneficiariesValid = function () {
                var result = !!$scope.charityBeneficiaries;

                if (result) {
                    $scope.registerForm.charityBeneficiaries.$setValidity('required', true);
                } else {
                    $scope.registerForm.charityBeneficiaries.$setValidity('required', false);
                }
                return result;
            };

            $scope.charityVolunteersValid = function () {
                var result = !!$scope.charityVolunteers;

                if (result) {
                    $scope.registerForm.charityVolunteers.$setValidity('required', true);
                } else {
                    $scope.registerForm.charityVolunteers.$setValidity('required', false);
                }
                return result;
            };

            $scope.sendRegistration = function () {
                var registrationData = {
                    profileType: $scope.profileType,
                    email: $scope.email,
                    password: $scope.password1,
                    repeatPassword: $scope.password2,
                    fullName: $scope.fullName,
                    charityName: $scope.charityName,
                    businessName: $scope.businessName,
                    charityNumber: $scope.charityNumber,
                    postCode: $scope.postCode,
                    phoneNumber: $scope.phoneNumber,
                    transportationMode: $scope.transportationMode,
                    collectionTime: $scope.collectionTime,
                    donationFrequency: $scope.donationFrequency,
                    donationSize: $scope.donationSize,
                    charityBeneficiaries: $scope.charityBeneficiaries,
                    charityVolunteers: $scope.charityVolunteers
                };

                // Show loading mask
                $scope.$root.loading = true;

                var profileGeomPoint;

                var addressInfo = registrationData.postCode;
                LocationService.resolveCoordinatesFromAddress(addressInfo)
                    .then(function (point) {
                        profileGeomPoint = point;
                         if (profileGeomPoint) {
                            registrationData.longitude = profileGeomPoint.lng();
                            registrationData.latitude = profileGeomPoint.lat();
                        }

                        console.log('Register profile with data: ', registrationData);
                        RegistrationService.register(registrationData).then(
                            function (data) {
                                $scope.$root.loading = false;

                                // received the token, let's automatically sign into the application form here on
                                var sessionAuthToken = data.token,
                                    userProfile = data.profile;
                                SessionService.setAuthToken(sessionAuthToken);
                                SessionService.setUserAuthenticated(true);
                                SessionService.setCurrentUser(userProfile);
                                $scope.$root.$broadcast('userChanged', userProfile);
                                $scope.$root.$broadcast('login');

                                // redirect to the thank you page
                                $state.go('registration_thanks');
                            },
                            function (response) {
                                $scope.$root.loading = false;
                                handleServerErrors(response.error);
                            });
                    }, function(err){
                        console.log(err);
                        $scope.$root.loading = false;
                        $scope.registerForm.postCode.$setValidity('postCode', false);
                        $window.alert(err+" Please check your postcode.");
                    });
            };

            //This ugly handler deals with server errors
            //Possibly will never be used because of front validation
            function handleServerErrors(err) {
                console.log('RegistrationController.handleServerError(), error: ', err);
                if (err) {
                    var error = err.invalidAttributes || {};
                    if (err.msg === 'Username is already taken.') {
                        $scope.registerForm.email.$setValidity('server', true);
                        $state.go('login', {
                            scenario: 'already', 
                            email: $scope.email
                        });
                    } else if (error.repeatPassword) {
                        $scope.password2 = '';
                        $scope.registerForm.repeatPassword.$setValidity('format', false);
                    }
                }
            }

        }]);
