"use strict";

angular.module('planz.controllers').
    controller('MapController', ['$scope', '$rootScope', '$modal', 'ProfileService', 'SessionService',
        function ($scope, $rootScope, $modal, ProfileService, SessionService) {

            $scope.selectedPlace = null;

            var currentUser = SessionService.getCurrentUser();
            if (currentUser) {
              $scope.userLatitude = currentUser.latitude || 51.507;
              $scope.userLongitude = currentUser.longitude || -0.128;
            } else {
              $scope.userLatitude = 51.507;
              $scope.userLongitude = -0.128;
            }

            $scope.$watch("selectedPlace", function(newValue, oldValue) {
              if (!angular.equals(newValue, oldValue)) {
                $scope.selectedPlace = newValue;
                $scope.processSelection();
              }
            });

            /**
             * Invoked when the items on the Map needs to be filtered
             *
             * @param term  the search term
             */
            $scope.processSelection = function() {
              //pick first from results
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode({ 'address': $scope.searchTerm, 'region': 'uk' , bounds: getLondonAreaBound()}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results && results.length!==0) {
                  $scope.selectedPlace = results[0];
                  var geometry = $scope.selectedPlace.geometry;
                  $scope.$broadcast("map_navigate", {
                      lng: geometry.location.lng(),
                      lat: geometry.location.lat(),
                      bounds: geometry.viewport
                  });
                } else {
                  return;
                }
              });
            };

            function getLondonAreaBound(autocomplete){
              var londonAreaBound, swLatLng, neLatLng;
              // coordinates http://geojson.io/#id=gist:anonymous/fff8553da97317545d7b&map=9/51.6061/-0.2321
              swLatLng = new google.maps.LatLng(51.29363900554651, -1.225777644433606);
              neLatLng = new google.maps.LatLng(51.721013046169745, 0.47710321494139407);

              londonAreaBound = new google.maps.LatLngBounds(swLatLng, neLatLng);
              return londonAreaBound;
            }
        }]);
