'use strict';

angular.module('planz.directives')
    .directive('activeNavItem', [function ($location) {
        return {
            link: function activeNavItem(scope, element, attrs) {
                scope.$on("$routeChangeSuccess", function (event, current, previous) {
                    var activeNavItemClass = attrs.activeNavItem;
                    if (false === current.hasOwnProperty('$$route')) {
                      return false;
                    }
                    var navigationClass = current.$$route.navigationClass;

                    if (navigationClass === activeNavItemClass) {
                        element.addClass("active");
                    } else {
                        element.removeClass("active");
                    }
                });
            }
        };
    }]);
