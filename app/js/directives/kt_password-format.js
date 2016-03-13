'use strict';

/**
 * password-match
 * AngularJS directive for verifying the password match entered in a text field
 */

angular.module('planz.directives')
    .directive('passwordFormat', ['$parse', '$compile', function ($parse, $compile) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                element.on('change', function (event) {
                    var password = element.val();
                    var re = /^(?=.{6})(?=(?:.*[A-Z]){1})(?=(?:.*\d){1})/;
                    var result = re.test(password);
                    ctrl.$setValidity('format', result);
                });
            }
        };
    }]);