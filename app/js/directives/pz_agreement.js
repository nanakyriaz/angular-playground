(function() {
'use strict';

/**
 * Widgets
 */
angular
  .module('planz.directives')
  .directive('pzAgreement', function(){
    return {
      restrict: 'A',
      replace: true,
      scope: {
        type: '=',
        acceptedAgreement: "=",
        acceptedTerms: "="
      },
      template: '<div ng-include="getTemplateUrl()"></div>',
      controller: function($scope){
        console.log('agreementWidget controller instantiated');
        
        //function used on the ng-include to resolve the template
        $scope.getTemplateUrl = function() {
          if ($scope.type === 'business') {
            return "js/directives/agreements/business_agreement.html";
          }  
          if ($scope.type === 'charity') {
            return "js/directives/agreements/charity_agreement.html";
          } else {
            return "js/directives/agreements/accept_terms.html";
          }
        };
      }
    };
  });

})();