(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzCollectionTimes', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        collectionTimes: "="
      },
      templateUrl: 'js/directives/pz_collection_times.html',
      controller: function($scope){
        console.log('collectionTimesWidget controller instantiated');

        $scope.toggleOption = function(timeSlot, day){
          $scope.collectionTimes[timeSlot][day] = !$scope.collectionTimes[timeSlot][day];
        };
      }
    };
  });

})();