"use strict";

angular.module('planz.services').
    service('LocationService', ['$rootScope', '$http', '$q', '$timeout', 'ApiUrlValues', 'AddressService', function ($rootScope, $http, $q, $timeout, ApiUrlValues, AddressService) {

        /**
         * Stores the instance of the geocoder
         * @type {undefined}
         */
        var geocoder;

        /**
         *
         * @param address
         */
        this.convertToGoogleAddress = function (address) {
            if (address) {
                delete address.id;
                delete address.createdAt;
                delete address.updatedAt;
                delete address.other;
            }

            var result = '';
            for (var property in address) {
                var item = address[property];
                if (angular.isString(item) && null !== item) {
                    if (item !== '') {
                        result += item + ', ';
                    }
                }
            }

            // enforce including united kingdom
            //result += ', UK';
            console.log('Result: %s', result);
            return result;
        };

        this.assessCountryOfPostCode = function(address){
            return AddressService.assessCountryOfPostCode(address);
        };

        /**
         * Returns the coordinates from the given address
         *
         * @param address   the address info
         *
         * @returns {Deferred.promise|*}
         */
        this.resolveCoordinatesFromAddress = function (address) {
            // check if Google Maps gecoding class is available in the global space
            console.log('LocationService.resolveCoordinatesFromAddress(), address: ', address);
            if (!geocoder) {
                geocoder = new google.maps.Geocoder();
            }

            if (!address) {
                throw new Error('Address is not given.');
            }

            var addressInfo = address;
            if (angular.isObject(address)) {
                addressInfo = this.convertToGoogleAddress(address);
            }else{
                addressInfo = this.assessCountryOfPostCode(address);
            }

            var deferred = $q.defer();

            console.log('LocationService.resolveCoordinatesFromAddress(), addressInfo: ', addressInfo);
            geocoder.geocode({address: addressInfo}, function (results, status) {
                console.log('GEOCODING RESULT: ', results, status);
                if (status !== google.maps.GeocoderStatus.OK) {
                    deferred.reject('Your address could not be located.');
                }

                // if we have found something we assume the first hit is correct
                if (results.length > 0) {
                    console.log(results);

                    var allowedLocations = ["GB", "PT"];
                    for(var m = 0; m< results.length; m++){
                        var firstResult = results[m];
                        if (firstResult) {
                            var countryElement;
                            for(var i = 0; i<firstResult.address_components.length; i++){
                                var element = firstResult.address_components[i];
                                console.log("ELEMENT",element);
                                if(element.types && element.types[0] === 'country'){
                                    countryElement = element;
                                    console.log("found country");
                                    break;
                                }
                            }
                            console.log('Country Element: ', countryElement);
                            if(countryElement && allowedLocations.indexOf(countryElement.short_name)>-1){
                                var geometryLocation = firstResult.geometry.location;
                                console.log("acceptable country found");
                                deferred.resolve(geometryLocation);
                                break;
                            }
                        }
                    }
                    deferred.reject('The country associated with your postcode is not permitted. Rows detected'+results.length);
                } else {
                    deferred.reject('Your address could not be located.');
                }
            });

            return deferred.promise;
        };
    }]);
