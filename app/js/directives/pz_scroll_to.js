'use strict';

/**
 * scrol-to
 * AngularJS directive for anchor scroll
 */

angular.module('planz.directives')
    .directive('scrollTo', function ($location, $anchorScroll) {
        return function (scope, element, attrs) {
            element.bind('click', function (event) {
                event.stopPropagation();
                event.preventDefault();

                var location = attrs.scrollTo;
                var old = $location.hash();
                $location.hash(location);
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);
            });
        };
    });

