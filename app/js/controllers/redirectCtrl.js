'use strict';

angular.module('planz.controllers').
    controller('RedirectController', ['$scope', '$http', '$location', '$stateParams', '$state', '$rootScope', 'userProfile',
        function ($scope, $http, $location, $stateParams, $state, $rootScope, userProfile) {
          $scope.params = $stateParams;
          $scope.currentState = $state;

          // var redirectUrl = decodeURIComponent($stateParams.current.params.redirect_url);

          var redirectUrl = $location.search.redirect_url;
          console.log(redirectUrl);

          $scope.$root.$broadcast('userChanged', userProfile);
          $scope.$root.$broadcast('login');
            

          if (redirectUrl) {
            $location.path(redirectUrl);
          }
        }]);
