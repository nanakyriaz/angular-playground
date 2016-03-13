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
  .directive('tiAutosize', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      var threshold = 13,
          span, resize;

      span = angular.element('<span class="input"></span>');
      span.css('display', 'none')
        .css('visibility', 'hidden')
        .css('width', 'auto')
        .css('white-space', 'pre');

      element.parent().append(span);

      resize = function(originalValue) {
        var value = originalValue, width;
        if (angular.isString(value) && value.length === 0) {
          value = attrs.placeholder;
        }

        if (value) {
          span.text(value);
          span.css('display', '');
          width = span.prop('offsetWidth');
          span.css('display', 'none');
        }

        element.css('width', width ? width + threshold + 'px' : '');
        return originalValue;
      };

      ctrl.$parsers.unshift(resize);
      ctrl.$formatters.unshift(resize);

      attrs.$observe('placeholder', function(value) {
        if (!ctrl.$modelValue) {
          resize(value);
        }
      });
    }
  };
});
