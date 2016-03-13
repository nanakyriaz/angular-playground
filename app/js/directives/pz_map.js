'use strict';

angular.module('planz.directives')
    .directive('pzMap', [function () {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                navigationBar: '=',
                initialZoom: '=',
                minZoom: '=',
                maxZoom: '=',
                latitude: '=',
                longitude: '=',
                updatedSearchTerm: '='
            },
            controller: 'MapWidgetController',
            templateUrl: 'js/directives/pz_map.html',
            link: function (scope, element, attrs, ctrl) {
                var mapOptions,
                    latitude = attrs.latitude,
                    longitude = attrs.longitude,
                    minZoom = attrs.minZoom,
                    maxZoom = attrs.maxZoom,
                    initialZoom = attrs.initialZoom,
                    mapStyles,
                    map;

                // get the center of the map when rendering for the first time,
                // fallbacks to London when not given
                latitude = scope.latitude && parseFloat(scope.latitude) || 51.507;
                longitude = scope.longitude && parseFloat(scope.longitude) || -0.1284;

                minZoom = minZoom && parseInt(minZoom) || 12;
                maxZoom = maxZoom && parseInt(maxZoom) || 15;
                initialZoom = initialZoom && parseInt(initialZoom) || 10;

                //
                mapStyles = [{
                    featureType: 'poi.business',
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "off"
                        }
                    ]
                }];

                var mapCentreLocation = new google.maps.LatLng(latitude, longitude);
                mapOptions = {
                    zoom: initialZoom,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    center: mapCentreLocation,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    mapTypeControl: false, /* hide the map type switcher */
                    streetViewControl: false, /* disable streetview mode */
                    styles: mapStyles,

                    /* enable the zoom control on the map */
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    }
                };

                var mapElementContainer = $(element).find('.map-element')[0];
                map = new google.maps.Map(mapElementContainer, mapOptions);
                google.maps.visualRefresh = true;
                ctrl.setGoogleMaps(map);


            }
        };
    }]);
