(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzFoodTypes', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        foodTypes: '='
      },
      templateUrl: 'js/directives/pz_food_types.html',
      controller: function($scope){
        console.log('foodTypesWidget controller instantiated');
        
        $scope.foodTypesInfo = [
        { section: 'Fruits/Vegetables',
          items:[{ type: 'Fresh (ambient temp.)', image: ""}, { type: 'Canned', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}]
        },
        { section: 'Bread & Pastries',
          items: [{ type: 'Fresh (ambient temp.)', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}]
        },
        { section: 'Sandwiches',
          items: [{ type: 'Fresh (ambient temp.)', image: ""}, { type: 'Chilled', image: ""}]
        },
        { section: 'Dairy',
          items: [{ type: 'Long life', image: ""}, { type: 'Chilled (0c to 6C)', image: ""}, { type: 'Frozen', image: ""}]
        },
        { section: 'Raw Meat',
          items: [{ type: 'Chilled (0C to 6C)', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}]
        },
        { section: 'Cooked Meat',
          items: [{ type: 'Chilled (0C to 6C)', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}, { type: 'Canned', image: ""}]
        },
        { section: 'Raw Fish',
          items: [{ type: 'Chilled (0C to 6C)', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}]
        },
        { section: 'Cooked Fish',
          items: [{ type: 'Chilled (0C to 6C)', image: ""}, { type: 'Frozen (-10C to -25C)', image: ""}, { type: 'Canned', image: ""}]
        },
        { section: 'Soup',
          items: [{ type: 'Canned', image: ""}, { type: 'Hot', image: ""}, { type: 'Chilled', image: ""}]
        }
      ];
        $scope.toggleFoodType = function(row, column){
          $scope.foodTypes[row][column] = !$scope.foodTypes[row][column];
        };
      }
    };
  });

})();