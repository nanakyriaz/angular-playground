(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzVolunteerFoodTypes', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        foodTypes: '='
      },
      templateUrl: 'js/directives/pz_volunteer_food_types.html',
      controller: function($scope){
        console.log('pzVolunteerFoodTypesWidget controller instantiated');
        if (!$scope.foodType || $scope.foodType.length===0){
          $scope.foodType = [false, false, false];
        }
        $scope.foodTypesInfo = [
          { 
            title: 'Fresh',
            description: 'Ambient Temperature', 
            image: ""
          }, { 
            title: 'Chilled',
            description: '0C to 6C', 
            image: ""
          }, { 
            title: 'Frozen',
            description: '-10C to -25C', 
            image: ""
          }
        ];

        $scope.toggleFoodType = function(index){
          $scope.foodTypes[index] = !$scope.foodTypes[index];
        };
      }
    };
  });

})();