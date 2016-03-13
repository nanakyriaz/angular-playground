(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzTransporterFoodTypes', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        foodTypes: '='
      },
      templateUrl: 'js/directives/pz_transporter_food_types.html',
      controller: function($scope){
        console.log('transporterFoodTypesWidget controller instantiated');
        if (!$scope.foodType || $scope.foodType.length===0){
          $scope.foodType = [false, false, false];
        }
        $scope.foodTypesInfo = [
          { 
            title: 'Ambient Goods',
            description: 'In suitable manner', 
            image: ""
          }, { 
            title: 'Chilled Food',
            description: '0C to 6C', 
            image: ""
          }, { 
            title: 'Frozen Goods',
            description: '-10C to -25C', 
            image: ""
          }, { 
            title: 'Hot Food',
            description: '73C', 
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