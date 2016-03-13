'use strict';

angular.module('common.underscore', [])
    .factory('_', function ($window) {

        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
        $window._.mixin({ capitalise: capitalise });

        return $window._;
    });
