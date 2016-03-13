(function() {
'use strict';

/**
 * CheckStateChange Service
 */
angular 
  .module('planz.services')
  .factory('CheckStateChangeService', ['$rootScope', function ($rootScope){

  console.log('CheckStateChangeService instantiation');
  
  // reference implementation: http://stackoverflow.com/questions/25459287/not-allow-to-navigate-if-any-changes-on-form-using-dirty-and-pristine
  var checkFormOnStateChange = function($scope){ 
    
    var removeListener = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      // only applicable during registration
      if (toState.name && toState.name.indexOf("registration")===-1) {
        if(confirm("Are you sure you want to leave this page?")){ // jshint ignore:line
          return;
        } else {
          event.preventDefault();
          return; 
        }
      }

      if ($scope.form.$invalid && !toParams.skipValidation){
        console.log("form invalid blocking navigation");
        event.preventDefault();
        return;
      } else {
        // 
      }
    }); 
    $scope.$on("$destroy", removeListener);
    
    var stateChangeSuccessRemoveListener = $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.step = toState.data.step;
    });
    $scope.$on("$destroy", stateChangeSuccessRemoveListener);
  };

  return { 
    checkFormOnStateChange : checkFormOnStateChange
  };
}]);

})();