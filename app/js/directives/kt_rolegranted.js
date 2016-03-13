'use strict';

/**
 * role-granted
 * AngularJS directive to hide/show UI elements depending on authenticated user roles
 */

angular.module('planz.directives')
  .directive('roleGranted', ['ngIfDirective', 'SessionService', function (ngIfDirective, SessionService) {
    var ngIf = ngIfDirective[0];

    return {
      transclude: ngIf.transclude,
      priority: ngIf.priority,
      terminal: ngIf.terminal,
      restrict: ngIf.restrict,
      link: function($scope, $element, $attr) {
        var roles = $attr.roleGranted;
        var displayElement = false;

        // keep track of the displayElement-flag
        $attr.ngIf = function() {
          return displayElement;
        };
        ngIf.link.apply(ngIf, arguments);

        var handleLoginEvent = function() {
          if (SessionService.checkRole(roles)) {
            displayElement = true;
          } else {
            displayElement = false;
          }
        };

        $scope.$on('login', function() {
          handleLoginEvent();
        });

        $attr.$observe('roleGranted', function (value) {
          if (SessionService.checkRole(value)) {
            displayElement = true;
          } else {
            displayElement = false;
          }
        });
      }
    };
  }]);
