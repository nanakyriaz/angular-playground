(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzRoleTypes', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        roleTypes: '='
      },
      templateUrl: 'js/directives/pz_role_types.html',
      controller: function($scope){
        console.log('roleTypesWidget controller instantiated');
        $scope.roles = [
          { 
            title: 'Build Relationships',
            description: 'Support relationships between businesses, charities and volunteers', 
            image: ""
          }, { 
            title: 'Spread the word',
            description: 'Recruit new Zheroes', 
            image: ""
          }, { 
            title: 'Move Food',
            description: 'Recruit new Zheroes', 
            image: ""
          }
        ];
         

        $scope.toggleRoleType = function(index){
          $scope.roleTypes[index] = !$scope.roleTypes[index];
        };
      }
    };
  });

})();