'use strict';

angular.module('planz.directives')
    .directive('pzDeliveryReport', [function () {
        return {
            restrict: 'EA',
            scope: {
                viewMode: '=',
                currentReportPeriod: '='
            },
            controller: 'DeliveryReportController',
            templateUrl: 'js/directives/pz_delivery_report.html',
            link: function (scope, element, attrs) {
            }
        };
    }]);
