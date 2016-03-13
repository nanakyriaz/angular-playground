'use strict';

/**
 * ng-file-select
 * AngularJS directive for fixing button click for upload
 */

angular.module('planz.directives')
    .directive('ktUploadButton', [function () {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                if ($element.prop('tagName') === 'BUTTON') {
                    $element.bind('click', function (e) {
                        angular.element(this).find('input').get(0).click();
                    });
                }
            }
        };
    }]);