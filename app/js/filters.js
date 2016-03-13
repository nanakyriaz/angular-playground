'use strict';

/* Filters */

angular.module('planz.filters', [])

/**
 * Returns the application version
 */
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])

/**
 * Join the values of the given list into a string
 */
    .filter('join', function () {
        return function (list, token) {
            return (list || []).join(token);
        };
    })

/**
 * Returns the time without seconds and timezone
 */
  .filter('time', function() {
        return function(text) {
          if (null === text) {
            return '';
          }

          return String(text).substr(0, 5);
        };
  })

/**
 * Retrieve values of the given property name of the array
 */
    .filter('pluck', function () {
        function pluck(objects, property) {
            if (!(objects && property && angular.isArray(objects))) {
                return [];
            }

            property = String(property);

            return objects.map(function (object) {
                // just in case
                object = Object(object);

                if (object.hasOwnProperty(property)) {
                    return object[property];
                }

                return '';
            });
        }

        return function (objects, property) {
            return pluck(objects, property);
        };
    })

/**
 * Skips the given message id from the list
 */
    .filter('skipMessageId', function () {
        return function (messageItems, firstMessageId) {
            var filteredItems = [];
            if (false === angular.isDefined(messageItems)) {
                return filteredItems;
            }

            for (var i = 0; i < messageItems.length; i++) {
                if (messageItems[i].id !== firstMessageId) {
                    filteredItems.push(messageItems[i]);
                }
            }
            return filteredItems;
        };
    })


/**
 * sorts the profile items for my communities by  profile type
 */
    .filter('profileItemsForType', function () {
        return function (profileItems, currentProfileType) {
            var filteredItems = [];
            if (false === angular.isDefined(profileItems)) {
                return filteredItems;
            }

            for (var i = 0; i < profileItems.length; i++) {
                if (profileItems[i].profileType === currentProfileType) {
                    filteredItems.push(profileItems[i]);
                }
            }
            return filteredItems;
        };
    })

/**
 * capitalizes the first letter of the input
 */
    .filter('capitalizeFirstLetter', function () {
        return function (input, scope) {
            if (null === input) {
              return input;
            }

            if (input != null) {
                input = input.toLowerCase();
            }
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        };
    });
