"use strict";

angular.module('planz.controllers').
    controller('MyCommunityController', ['$scope', '$rootScope', '$location', '$stateParams', '$q', 'communityFriends', 'ProfileService', '$state',

        function ($scope, $rootScope, $location, $stateParams, $q, communityFriends, ProfileService, $state) {

            if ($stateParams.hasOwnProperty('type') && $stateParams.type !== "") {
                $scope.activeSection = $stateParams.type;
            } else {
                $scope.activeSection = 'businesses';
            }

            var isFirstRun = false;
            var profileItems = $scope.profileItems = [];
            var communityItems = $scope.communityItems = [];

            /**
             * Change the section of the tab view
             * @param section the section to change to
             */
            $scope.changeSection = function(section) {
                $scope.activeSection = section;
                $state.go('my_community', {type: section});
            };

            if (false === isFirstRun) {
              isFirstRun = true;
              
              angular.forEach(communityFriends, function(item) {
                communityItems.push(item);
              });
            } else {
                console.log('Data already retrieved.');
            }
        }]);
