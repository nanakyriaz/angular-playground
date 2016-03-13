'use strict';

angular.module('planz.directives')
    .directive('pzShare', ['$modal', '$window', function ($modal, $window) {
        return {
            restrict: 'EA',
            scope: {
                page: '='

            },
            templateUrl: 'js/directives/pz_share.html',
            link: function (scope, element, attrs) {
                scope.shareMail = function (size) {
                    var modalInstance = $modal.open({
                        templateUrl: 'js/directives/pz_mail_modal.html',
                        controller: 'ShareController',
                        size: size,
                        resolve: {
                            items: function () {
                                return ''; //$scope.items;
                            }
                        }
                    });
                };

                scope.print = function () {
                    $window.print();
                };

            }
        };
    }]);
