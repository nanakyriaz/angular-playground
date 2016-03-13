"use strict";

angular.module('planz.services').
    service('LoginService', ['$rootScope', '$http', '$q', 'ApiUrlValues', 'SessionService', 'ProfileService', function ($rootScope, $http, $q, ApiUrlValues, SessionService, ProfileService) {
        var me = this;
        var redirectWhenLoggedIn;

        /**
         * Logins in the user with the given credentials
         * @param username the username
         * @param password  the password
         * @param remember  rememember the user
         * @returns {Deferred.promise|*}
         */
        this.login = function (username, password, remember) {
            var deferred = $q.defer();
            console.log('URL: ' + ApiUrlValues.login);

            $http({
                method: 'POST',
                url: ApiUrlValues.login,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $.param({
                    identifier: username,
                    password: password,
                    remember_me: !!remember
                })
            }).success(function (data, status, headers, config) {
                console.log('Successfully logged in, received data: ', data);

                // Set the authentication token for the REST API
                SessionService.setAuthToken(data.token);

              // Retrieve user profile
                me.getProfile(data.user.email).then(
                    function (userData) {
                        SessionService.setCurrentUser(userData);
                        SessionService.setUserAuthenticated("true");
                        $rootScope.isLoggedIn = true;
                        $rootScope.$broadcast('login');

                        deferred.resolve(userData);
                    }, function (errorMessage) {
                        console.log(errorMessage);
                        SessionService.setAuthToken("");

                        deferred.resolve(data);
                    }
                );

            }).error(function (data, status, headers, config) {
                console.log('Data: ', data);
                console.log('Config: ', config);
                deferred.reject({httpStatus:status, error:data});
            });

            return deferred.promise;
        };

        /**
         * Logs out the authenticated user
         * @returns {Deferred.promise|*}
         */
        this.logout = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.logout)
                .success(function (data, status) {
                    $rootScope.isLoggedIn = false;
                    deferred.resolve(status);
                })
                .error(function (data, status) {
                    console.log("Logout error", data);
                    deferred.reject(status);
                });

            return deferred.promise;
        };

        /**
         * Returns the public user profile details of the user
         *
         * @returns {Deferred.promise|*}
         */
        this.getProfile = function () {
            return ProfileService.getUserProfile();
        };

        /**
         * Refresh the session profile
         * @returns {Deferred.promise|*}
         */
        this.refreshSessionProfile = function () {
            var deferred = $q.defer(),
                currentUser = SessionService.getCurrentUser();

            if (null === currentUser) {
              this.getProfile().then(function(data) {
                SessionService.setCurrentUser(data);
                deferred.resolve(data);
              });

              return deferred.promise;
            }

            this.getProfile(currentUser.email).then(
                function success(data) {
                    SessionService.setCurrentUser(data);
                    deferred.resolve(data);
                },
                function () {
                    deferred.reject();
                }
            );

            return deferred.promise;
        };

        // Sends a request to reset the password
        this.requestPasswordReset = function (email) {
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.requestPasswordReset, email))
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        // Sends a request to reset the password
        this.requestConfirmReset = function (email) {
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.requestConfirmReset, email))
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        // Resets the password
        this.resetPassword = function (email, resetPasswordData) {
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.resetPassword, email), resetPasswordData)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };


        this.redirectAfterLogin = function (path) {
            redirectWhenLoggedIn = path;
        };

        this.getRedirectAfterLogin = function () {
            return redirectWhenLoggedIn;
        };
    }]);
