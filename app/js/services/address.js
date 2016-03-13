"use strict";

angular.module('planz.services').
    service('AddressService', ['$http', '$q', 'ApiUrlValues', function ($http, $q, ApiUrlValues) {

        var UK_POSTCODE_REGEX = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][‌​0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/;
        var PORTUGAL_POSTCODE_REGEX = /[0-9]{4}-[0-9]{3}/i;

        /**
         * Returns whether the given postcode is valid
         *
         * @param postcode  the postcode
         * @param country   the country to check against (not used currently)
         *
         * @returns {boolean}
         */
        this.validatePostcode = function(postcode) {
            if (UK_POSTCODE_REGEX.test(postcode) || PORTUGAL_POSTCODE_REGEX.test(postcode)){
                return true;
            }

            return false;
        };

        /**
         * Assesses which country the given postcode belongs to
         *
         * @param postcode  the postcode
         * @returns {address|string|*}
         */
        this.assessCountryOfPostCode = function(address) {
            var result = address;

            if (UK_POSTCODE_REGEX.test(address)) {
                result += " UK";
            }else if (PORTUGAL_POSTCODE_REGEX.test(address)) {
                result += " PORTUGAL";
            }

            return result;
        }
    }]);
