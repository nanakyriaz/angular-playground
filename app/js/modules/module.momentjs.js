'use strict';

angular.module('common.moment', [])
    .factory('moment', function ($window) {

        return $window.moment;
    });
