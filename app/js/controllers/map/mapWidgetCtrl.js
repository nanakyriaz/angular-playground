"use strict";

angular.module('planz.controllers').
    controller('MapWidgetController', ['$scope', '$element', '$rootScope', '$filter', '$modal', '$window', 'ProfileService', 'SessionService', 'MapUtils', 'ApiUrlValues', '$q', '$state',
        function ($scope, $element, $rootScope, $filter, $modal, $window, ProfileService, SessionService, MapUtils, ApiUrlValues, $q, $state) {

            /**
             * The zoom level where the profiles should appear on the map
             * @type {number}
             */
            this.displayByZoomLevel = 10;
            /**
             * The zoom level where the detailed pins of profiles should appear on the map
             * @type {number}
             */
            this.showDetailsPinsBy = 13;

            /**
             * The zoom level to use when we are moving to a specific profile on the map
             * @type {number}
             */
            this.profileZoomLevel = 17;

            /**
             * Stores whether the map is being shown for the first time
             * @type {boolean}
             */
            this.firstTime = true;


            /**
             * If the previous map render used HTMLpins
             * @type {boolean}
             */
            this.hasUsedHTMLPIN = false;

            /**
             * If the map is currrently being dragged
             * @type {boolean}
             */
            this.isDragging = false;

            /**
             * Retrieve the list of available donation size options
             * @type {Array}
             */
            var donationSizeList = $scope.donationSizeList = [];
            ProfileService.getDonationSizeList().then(function (data) {
                donationSizeList.push.apply(donationSizeList, data);
            });

            /**
             * Retrieve the list of available food type options
             * @type {Array}
             */
            var foodTypeList = $scope.foodTypeList = [];
            ProfileService.getFoodTypeList().then(function (data) {
                foodTypeList.push.apply(foodTypeList, data);
            });

            $scope.activeSection = 'businesses';
            $scope.isFiltered = false;
            $scope.filterBarExpanded = false;
            $scope.selectedMarkerProfile = null;
            $scope.approvedUser = SessionService.getUserApproved() || false;

            var googleMaps;
            var markers = [];
            var mapBoundaries;
            var searchCriteria = $scope.search = {};
            var profileItems = $scope.profileItems = [];
            var profileZoomLevel = 17;
            var self = this;

            if (this.firstTime && $window.innerWidth >= 859) {
                console.log('Page being displaying in large-view mode');
                $scope.filterBarExpanded = true;
                this.firstTime = false;
            }

            /**
             * Listen to the incoming event requesting to the change position of the map
             */
            $scope.$on('map_navigate', function(event, position) {
                var target = new google.maps.LatLng(position.lat, position.lng);
                if (position.bounds) {
                    googleMaps.fitBounds(position.bounds);
                } else {
                    googleMaps.setZoom(self.profileZoomLevel);
                    googleMaps.setCenter(target);
                }
            });

            /**
             * Mark the profile on the map
             *
             * @param profile   the profile data
             */
            $scope.locateProfileOnMap = function (profile) {
                var profileMarker = self.getMarkerByProfileId(profile.id);

                // zoom the map to the defined zoom level and pan to the marker
                googleMaps.setZoom(self.profileZoomLevel);
                googleMaps.panTo(profileMarker.getPosition());
            };

            /**
             * Add the given profile as friend to the list
             * @param profileId the id of the profile
             */
            $scope.addProfileAsFriend = function (profile) {
                var profileId = profile.id;
                ProfileService.addFriendToProfile(profileId).then(function () {
                    console.log('Successfully requested to add the user as a friend...');
                    profile.isFriend = true;
                });
            };

            /**
             * Add the given profile as friend to the list
             * @param profileId the id of the profile
             */
            $scope.removeProfileAsFriend = function (profile) {
                var profileId = profile.id;
                ProfileService.removeFriendFromProfile(profileId).then(function () {
                    console.log('Successfully requested to removed the user as a friend...');
                    profile.isFriend = false;
                });
            };

            /**
             * Returns the marker with the given profile id
             *
             * @param profileId the profile id
             * @returns {*}
             */
            this.getMarkerByProfileId = function (profileId) {
                for (var i = 0; i < self.markers.length; i++) {
                    var marker = self.markers[i];
                    if (marker.profileId === profileId) {
                        return marker;
                    }
                }

                return false;
            };

            /**
             * Display the profile details in a modal dialog
             *
             * @param profileId the id of the profile
             */
            $scope.displayProfile = function (profileId) {
                var profile = $filter('filter')($scope.profileItems, {id: profileId}, true);
                profile = profile[0];
                if(profile.isCurrentUser){
                    $scope.displayMyProfile();
                    return;
                }

                var popupModuleInstance = $modal.open({
                    templateUrl: '/profilePopup.html',
                    controller: 'ProfileModalController',
                    resolve: {
                        selectedProfile: function () {
                            return ProfileService.getProfileById(profileId);
                        }
                    }
                });

                popupModuleInstance.result.then(function () {
                    console.log('State 1');
                }, function () {
                    console.log('State 2');
                });
            };

            $scope.displayMyProfile = function(){
                $state.go('my_profile');
            };


            /**
             * Retrieve the profile items matching the given criteria
             */
            this.retrieveProfileItems = function retrieveProfileItems() {
                if (!mapBoundaries) {
                    console.info('MapWidgetController.retrieveProfileItems(): Map boundaries not available.');
                    return;
                }

                var requestParams = {
                    swLon: mapBoundaries.getSouthWest().lng(),
                    swLat: mapBoundaries.getSouthWest().lat(),
                    neLon: mapBoundaries.getNorthEast().lng(),
                    neLat: mapBoundaries.getNorthEast().lat()
                };

                ProfileService.getProfilesWithinBox(
                    requestParams.swLon, requestParams.swLat, requestParams.neLon, requestParams.neLat, searchCriteria)
                    .then(function (data) {
                        $scope.profileItems = data;
                    }
                );
            };

            /**
             * Toggles the visibility of the filter bar
             */
            $scope.toggleFilterBar = function () {
                $scope.filterBarExpanded = !$scope.filterBarExpanded;
            };

            /**
             * Refresh filter
             */
            $scope.refreshFilter = function () {
                if ($scope.search.profileType || $scope.search.donationSize || $scope.search.foodType) {
                    $scope.isFiltered = true;
                } else {
                    $scope.isFiltered = false;
                }

                searchCriteria = $scope.search;
                self.retrieveProfileItems();
            };

            /**
             * Clears the existing filter and update the filtered items
             */
            $scope.clearFilter = function () {
                $scope.isFiltered = false;
                $scope.search = {
                    profileType: undefined,
                    donationSize: undefined,
                    foodType: undefined,
                    searchTerm: undefined
                };

                $scope.updatedSearchTerm = "";
            };

            /**
             * Invoked when the profileItems-array changes contents
             */
            $scope.$watch("profileItems", function (newValue) {
                self.renderMap(newValue);
            });

            /**
             * Invoked when the updateSearchTerm-object changes contents
             */
            $scope.$watch("updatedSearchTerm", function (newValue) {
                $scope.search.searchTerm = newValue;
                $scope.refreshFilter();
            });

            $scope.$watch("search", function (newValue, oldValue) {
                $scope.refreshFilter();
            });

            /**
             * Clear all the markers from the Google Maps instance
             */
            this.clearAllMarkers = function () {
                angular.forEach(this.markers, function (item, key) {
                    item.setMap(null);
                });
                this.markers = [];
            };

            /**
             * Returns the contents for a map marker
             * @param key   the identifier of the marker
             * @param item  the marker data
             * @returns {string}
             */
            this.getPlaceMarker = function (key, item) {
                var isSelected = $scope.selectedMarkerProfile ? $scope.selectedMarkerProfile.id === item.id : false;
                var marker = "";
                if(item.isCurrentUser && angular.isObject(item.avatar)){
                    marker =  "<div id='marker" + key + "' class='map-pin-50x50 map-layer-icon-places-" + (isSelected ? "selected-" : "") + item.profileType + "'><img class='map-layer-icon-places-image' src='"+item.avatarImages.thumb+"' /></div>";

                }else{
                    marker =  "<div id='marker" + key + "' class='map-pin-50x50 map-layer-icon-places-" + (isSelected ? "selected-" : "") + item.profileType + "'></div>";

                }
                return marker;
            };

            /**
             * Returns whether to display html pins or not
             * @returns {boolean}
             */
            this.shouldUseHtmlPin = function () {
                return googleMaps.getZoom() >= this.showDetailsPinsBy ? true : false;
            };

            /**
             * Returns whether to display pins or not
             * @returns {boolean}
             */
            this.shouldDisplayPin = function () {
                return googleMaps.getZoom() >= this.displayByZoomLevel ? true : false;
            };

            /**
             * Returns the icons specification for a map marker
             * @param item
             * @returns {{url: string, scaledSize: {width: number, height: number}}}
             */
            this.getIconSpec = function (item) {
                var isRetina = true,
                    spec = {},
                    retinaIconUrl = '/images/maps/' + item.profileType + '-map-small_x2.png',
                    iconUrl = '/images/maps/' + item.profileType + '-map-small.png';
                return retinaIconUrl && isRetina ? {url: retinaIconUrl} : {url: iconUrl};
            };

            /**
             * Invoked when a profile gets selected on the map
             *
             * @param marker    the clicked map marker
             * @param item      the relevant profile
             */
            this.profileItemSelected = function (marker, item) {
                $scope.selectedMarkerProfile = item;
                $scope.displayProfile(item.id);
            };


            /**
             * Selectively remove items from the map if they are already present
             *
             * @param data      the new markers to be added
             */
            this.selectiveClearMarkers =  function (data){

                // Create dictionary from new elements
                var dictionary = {};
                angular.forEach(data, function (item, key){
                    dictionary[item.fullName] = 1;
                });

                // remove non required markers and maintain existing
                var existingMarkers = [];
                angular.forEach(this.markers, function (item, key) {
                    if(dictionary[item.title] === 1){
                        dictionary[item.title] = 0;
                        existingMarkers.push(item);
                    }else{
                        // Remove marker
                        item.setMap(null);
                    }
                });

                // reset the existing markers
                this.markers = existingMarkers;

                // compile updated array of elements that need to be added
                var updatedDataArray = [];
                angular.forEach(data, function (item, key){
                    if(dictionary[item.fullName] === 1){
                        updatedDataArray.push(item);
                    }
                });

                // return updated required markers
                return updatedDataArray;
            };

            /**
             * Render the markers on the map
             */

            this.renderMap = function (data) {
                if (!googleMaps) {
                    console.warn('Google Maps instance is not available for the widget!');
                    return;
                }


                var me = this,
                    zoomLevel = googleMaps.getZoom();

                var updatedDataArray = data;
                if(this.hasUsedHTMLPIN === me.shouldUseHtmlPin()){
                    updatedDataArray = this.selectiveClearMarkers(data);
                }else{
                    this.clearAllMarkers();
                }

                if (false === this.shouldDisplayPin()) {
                    console.log('Not displaying the markers from this zoom zoomlevel');
                    return;
                }
                this.hasUsedHTMLPIN = me.shouldUseHtmlPin();
                //
                angular.forEach(updatedDataArray, function (item, key) {
                    var latLng = new google.maps.LatLng(item.latitude, item.longitude),
                        currentMarker;

                    if (me.shouldUseHtmlPin()) {
                        currentMarker = new MapUtils.HtmlMarker({
                            title: item.fullName,
                            profileId: item.id,
                            map: googleMaps,
                            iconAnchor: {x: 25, y: 25},
                            html: me.getPlaceMarker(key, item),
                            zIndex: key,
                            position: latLng
                        });
                    } else {
                        currentMarker = new google.maps.Marker({
                            title: item.fullName,
                            profileId: item.id,
                            map: googleMaps,
                            icon: me.getIconSpec(item),
                            clickable: false,
                            zIndex: key,
                            position: latLng
                        });
                    }

                    me.markers.push(currentMarker);

                    google.maps.event.addListener(currentMarker, "click", function () {
                        if(!me.isDragging){
                            me.profileItemSelected(currentMarker, item);
                            if (currentMarker.setAnimation) {
                                currentMarker.setAnimation(google.maps.Animation.BOUNCE);
                            }
                        }
                    });
                });
            };

            /**
             * Invoked when the google maps instance becomes idle after panning or zooming.
             */
            this.mapBoundariesChanged = function () {
                mapBoundaries = googleMaps.getBounds();
                this.retrieveProfileItems();
            };

            /**
             * Sets the Google Maps instance associated with the widget controller
             *
             * @param map   the google map instance
             */
            this.setGoogleMaps = function (map) {
                if (googleMaps) {
                    throw new Error('Map widget has already been initialised.');
                }

                // keep track of the google maps
                googleMaps = map;

                google.maps.event.addListener(map, 'idle', function () {
                    self.mapBoundariesChanged();
                });

                google.maps.event.addListener(googleMaps, 'dragend', function() {
                    self.isDragging = true;
                    setTimeout(function(){ self.isDragging = false; }, 200);
                } );
            };
        }]);
