'use strict';

/**
 * @ngdoc directive
 * @name ktAutosize
 * @module pz_profile_picker
 *
 * @description
 * Automatically sets the input's width so its content is always visible. Used internally by profilePicker directive.
 */
angular.module('planz.directives')
  .directive('ktNumericOnly', function() {

    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          return undefined;
        }

        ctrl.$parsers.push(inputValue);
      }
    };
  });
