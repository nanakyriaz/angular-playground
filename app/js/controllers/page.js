"use strict";

angular.module('planz.controllers').
  controller('PageController', ['$scope', '$location', '$stateParams', '$anchorScroll', function ($scope, $location, $stateParams, $anchorScroll) {


      console.log('PageController.index()', $stateParams);

      if ($stateParams.target) {
          var old = $location.hash();
          $location.hash($stateParams.target);
          $anchorScroll();
          //reset to old to keep any additional routing logic from kicking in
          $location.hash(old);
      }

  }]);
