"use strict";

angular.module('planz.services').
    service('RegistrationService', ['$rootScope', '$http', '$q',  'SessionService', 'LoginService', 'ApiUrlValues', function ($rootScope, $http, $q, SessionService, LoginService, ApiUrlValues) {


        /**
         * Registers for a profile account using thee given data
         *
         * @param registrationData the account data
         * @returns {*}
         */
        this.register = function (registrationData) {
            var deferred = $q.defer();

            $http.post(ApiUrlValues.register, registrationData)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        /**
         * Confirms the user account with the given credentials
         *
         * @param emailAddress      the email address of the account
         * @param confirmationToken the confirmation token
         * @returns {*}
         */
        this.confirmRegistration = function (emailAddress, confirmationToken) {
            var deferred = $q.defer();

            $http.get(String.format(ApiUrlValues.completeRegistration, emailAddress, confirmationToken))
                .success(function (data, status, headers, config) {
                    // account has been successfully confirmed, now we use the temporary token to login in the user
                    if (data.token && false === SessionService.getUserAuthenticated()) {
                      SessionService.setAuthToken(data.token);
                      var userData = data;
                      delete userData.token;
                      SessionService.setUserAuthenticated(true);
                      LoginService.getProfile().then(function(profileData) {
                        console.log('RegistrationService.confirmRegistration(): Updating user profile data');
                        SessionService.setCurrentUser(profileData);
                        deferred.resolve(data);
                      });
                    } else {
                      console.log('RegistrationService.confirmRegistration(): User is already authenticated.');
                      deferred.resolve(data);
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        /**
         * Update the registration details of the authenticated user
         *
         * @param registrationData  the registration data
         * @param userId  the user identifier
         * @returns {*}
         */
        this.updateRegistration = function (registrationData, userId) {
            var deferred = $q.defer();

            $http.put(String.format(ApiUrlValues.updateRegistration, userId), registrationData)
                .success(function (data, status, headers, config) {
                    console.log('RegistrationService.updateRegistration(): Data: ', data);
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    console.log('RegistrationService.updateRegistration(): Error: ', data);
                    deferred.reject("An error occurred while updating registration");
                });

            return deferred.promise;
        };

    }]);
