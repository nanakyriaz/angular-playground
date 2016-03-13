"use strict";

angular.module('planz.services').
    service('CountryService', ['$http', '$q', 'ApiUrlValues', function ($http, $q, ApiUrlValues) {

        var countries = [];

        this.getCountries = function () {
            var deferred = $q.defer();

            if (countries.length) {
                deferred.resolve(countries);
            } else {
                $http.get(ApiUrlValues.countries)
                    .success(function (data) {
                        for (var i in data) {
                            countries.push({
                                name: data[i].name,
                                identifier: data[i].identifier
                            });
                        }
                        deferred.resolve(countries);
                    }).error(function (error) {
                        deferred.reject(error);
                    });
            }

            return deferred.promise;
        };
    }]);