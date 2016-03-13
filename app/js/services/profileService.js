"use strict";

angular.module('planz.services').
    service('ProfileService', ['$http', '$q', '$window', '$timeout', 'SessionService', 'ApiUrlValues', function ($http, $q, $window, $timeout, SessionService, ApiUrlValues) {

        /**
         * Check if the current authenticated user profile is friends with the given profile
         *
         * @param profile   the profile
         * @returns {*}
         */
        function decorateFriendRelation(profile) {
            if (profile.hasOwnProperty('isFriend')) {
                console.warn('Profile already has the `isFriend`-property');
                return profile;
            }

            var isFriend = false;
            var currentProfileId = SessionService.getCurrentUser() ? SessionService.getCurrentUser().id : -1;
            if (profile.friends) {
                // check against the authenticated profile id
                isFriend = profile.friends.indexOf(currentProfileId) !== -1;
            }

            profile.isCurrentUser = profile.id === currentProfileId;
            profile.isFriend = isFriend;
            return profile;
        }

        /**
         * Returns the alerts associated with the authenticated profile
         *
         * @returns {Deferred.promise|*}
         */
        this.getProfileAlerts = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.ProfileAlerts)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns a list of profile names containing the search term in the profile name
         * @param search      the search term
         * @param profileType the profile type
         */
        this.getProfilesByName = function(search, profileType) {
          var deferred = $q.defer();
          if (search && search.length === 0) {
            console.log('Search term is empty!');
            return deferred.resolve([]);
          }
          $http.get(ApiUrlValues.ProfileSearchByName, {params: {search:search, profileType:profileType}})
            .success(function (data) {
              console.log('getProfilesByName(): ', data);
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };


        /**
         * Returns all the available profiles
         *
         * @returns {Deferred.promise|*}
         */
        this.getAllProfiles = function () {
            var deferred = $q.defer();
            $http.get(ApiUrlValues.ProfileListing)
                .success(function (data) {
                    data.map(decorateFriendRelation);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns all the unapproved profiles
         *
         * @returns {Deferred.promise|*}
         */
        this.getUnapprovedProfiles = function () {
            var deferred = $q.defer();
            $http.get(ApiUrlValues.adminUnapprovedProfilesListing)
                .success(function (data) {
                    data.map(decorateFriendRelation);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        this.exportProfiles = function(approved) {
            var deferred = $q.defer();

            var token = SessionService.getAuthToken();
            if (false === token) {
                return deferred.reject();
            }

            var url = ApiUrlValues.adminExportUnapprovedProfiles;
            if(approved){
                url = ApiUrlValues.adminExportApprovedProfiles;
            }

            // create hidden iframe and wait for completed event to be dispatched
            var downloadUrl = url + '?token=' + token;
            var iframe = angular.element('<iframe>')
                .attr('src', downloadUrl)
                .attr('style', 'width: 0px; height: 0px')
                .appendTo('body').load(function () {
                    $timeout(function() {
                        console.log('exportNewsletterSubscribers(), Done!');
                        iframe.remove();
                        deferred.resolve();
                    }, 500);
                });


            return deferred.promise;
        };

        /**
         * Returns all the approved profiles
         *
         * @returns {Deferred.promise|*}
         */
        this.getApprovedProfiles = function () {
          var deferred = $q.defer();
          $http.get(ApiUrlValues.adminApprovedProfilesListing)
            .success(function (data) {
              data.map(decorateFriendRelation);
              deferred.resolve(data);
            }).error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        };

        /**
         * Approve the profile with the given identifier
         *
         * @param profileId the identifier of the profile
         *
         * @returns {Deferred.promise|*}
         */
        this.approveProfileById = function (profileId) {
            var deferred = $q.defer();
            $http.get(String.format(ApiUrlValues.adminProfileApprove, profileId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Unapprove the profile with the given identifier
         *
         * @param profileId the identifier of the profile
         *
         * @returns {Deferred.promise|*}
         */
        this.unapproveProfileById = function unapproveProfileById(profileId) {
            var deferred = $q.defer();
            $http.get(String.format(ApiUrlValues.adminProfileUnapprove, profileId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
        this.unapproveProfiles = function unapproveProfiles(profiles) {
            return batchOperation('unapproveProfileById', profiles, this);
        };

        function batchOperation(operationName, profiles, scope) {
            //scope = scope || this;
            var promises = [];
            for (var i = 0, c = profiles.length; i < c; i++) {
                promises.push(scope[operationName](profiles[i].id));
            }
            return $q.all(promises);
        }
        /**
         * Deactivate the profile with the given identifier
         *
         * @param profileId the identifier of the profile
         *
         * @returns {Deferred.promise|*}
         */
        this.deactivateProfileById = function (profileId) {
            var deferred = $q.defer();
            $http.get(String.format(ApiUrlValues.adminProfileDeactivate, profileId))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
        this.deactivateProfiles = function deactivateProfiles(profiles) {
            return batchOperation('deactivateProfileById', profiles, this);
        };

        /**
         * Returns the available profiles with the given filter
         *
         * @param filter the filters for profiles
         *
         * @returns {Deferred.promise|*}
         */
        this.getProfiles = function (filter) {
            //console.log('ProfileService.getProfiles(), filter: ', filter);
            var searchCriteria = filter || {};

            var deferred = $q.defer();
            $http.get(ApiUrlValues.ProfileListing, {params: searchCriteria})
                .success(function (data) {
                    data.map(decorateFriendRelation);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Resolve the participants based on the selection by issueing a network request
         * @param participants
         */
        this.resolveParticipants = function(participants) {
          console.log('ProfileService.resolveParticipants(), participants: ', participants);
          var deferred = $q.defer();
          deferred.resolve(participants);
          return deferred.promise;
        };

        /**
         * Returns the profiles within the geometric bounding box
         *
         * @param swLat the south west latitude position
         * @param swLon the south west longitude position
         * @param neLat the north east latitude position
         * @param neLon the north east longitude position
         * @param criteria  extra criteria parameters (for filtering)
         *
         * @returns {Deferred.promise|*}
         */
        this.getProfilesWithinBox = function (swLat, swLon, neLat, neLon, criteria) {
            var deferred = $q.defer();

            var requestParameters = {
                swLat: swLat,
                swLon: swLon,
                neLat: neLat,
                neLon: neLon
            };
            angular.extend(requestParameters, criteria);

            // retrieve the profiles
            $http.get(ApiUrlValues.ProfileListingNearbyBox, {params: requestParameters})
                .success(function (data) {
                    data.map(decorateFriendRelation);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the profile information for the given identifier
         *
         * @param id    the profile identifier
         * @returns {Deferred.promise|*}
         */
        this.getProfileById = function (id) {
            var deferred = $q.defer();

            $http.get(String.format(ApiUrlValues.ProfileDisplay, id))
                .success(function (data) {
                    decorateFriendRelation(data);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the profile information for the given identifier
         *
         * @param id    the profile identifier
         * @returns {Deferred.promise|*}
         */
        this.addFriendToProfile = function (id) {
            var deferred = $q.defer();

            $http.post(String.format(ApiUrlValues.AddFriendToProfile, id))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the profile information for the given identifier
         *
         * @param id    the profile identifier
         * @returns {Deferred.promise|*}
         */
        this.removeFriendFromProfile = function (id) {
            var deferred = $q.defer();

            $http['delete'](String.format(ApiUrlValues.AddFriendToProfile, id))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the profile information for the given identifier
         *
         * @param id    the profile identifier
         * @returns {Deferred.promise|*}
         */
        this.getUserProfile = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.ProfileUserDisplay)
                .success(function (data) {
                    decorateFriendRelation(data);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the settings of the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.updateUserProfile = function (settings) {
            var deferred = $q.defer();

            $http.put(ApiUrlValues.UpdateProfile, settings)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of community profiles associated with the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.getCommunityProfiles = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.ProfileListingCommunity)
                .success(function (data) {
                    data.map(decorateFriendRelation);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of donation sizes
         *
         * @returns {Deferred.promise|*}
         */
        this.getDonationSizeList = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.ProfileDonationSizeListing)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of available collection times
         * @returns {Deferred.promise|*}
         */
        this.getCollectionTimeList = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.ProfileCollectionTimeListing)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the list of available food types
         *
         * @returns {Deferred.promise|*}
         */
        this.getFoodTypeList = function () {
            var deferred = $q.defer();
            $http.get(ApiUrlValues.ProfileFoodTypeListing)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the settings of the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.getUserSettings = function () {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.UserSettings)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the settings of the authenticated user
         *
         * @returns {Deferred.promise|*}
         */
        this.updateUserSettings = function (settings) {
            var deferred = $q.defer();

            $http.put(ApiUrlValues.UserSettings, settings)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Updates the password of the authenticated user
         *
         * @param settings  the password settings
         *
         * @returns {Deferred.promise|*}
         */
        this.updatePasswordSettings = function (settings) {
            var deferred = $q.defer();

            $http.put(ApiUrlValues.changePassword, settings)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
