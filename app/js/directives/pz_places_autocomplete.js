'use strict';

angular.module('planz.directives')
  .directive('pzPlacesAutocomplete', [function () {
    
    function setLondonAreaBound(autocomplete){
      var londonAreaBound, swLatLng, neLatLng;
      // coordinates http://geojson.io/#id=gist:anonymous/fff8553da97317545d7b&map=9/51.6061/-0.2321
      swLatLng = new google.maps.LatLng(51.29363900554651, -1.225777644433606);
      neLatLng = new google.maps.LatLng(51.721013046169745, 0.47710321494139407);

      londonAreaBound = new google.maps.LatLngBounds(swLatLng, neLatLng);
      autocomplete.setBounds(londonAreaBound);
    }

    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        place: '=?',
        onEnter: '&'
      },

      /**
       * @inheritDoc
       */
      link: function(scope, element, attrs, controller) {
          element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
              event.preventDefault();
              scope.onEnter();
            }
          });

          if (!scope.autocomplete) {
              scope.autocomplete = new google.maps.places.SearchBox(element[0]);
              //bias results to London Area
              if (scope.autocomplete) {
                setLondonAreaBound(scope.autocomplete);
              }
          }

          google.maps.event.addListener(scope.autocomplete, 'places_changed', updateSelection);

          function updateSelection(){
            setLondonAreaBound(scope.autocomplete);
            var places = scope.autocomplete.getPlaces();
            if (places.length === 0) {
              console.log('PlacesAutocomplete(): No places returned.');
              return;
            }
            console.log('PlacesAutocomplete(): totalPlaces: %s', places.length);

            // grab the first item on the list
            var selectedPlace = places[0];
            console.log('PlacesAutocomplete(): selectedPlace: %s', selectedPlace);
            if (selectedPlace !== undefined) {
              // change the selected place so its accessible abroad
              scope.$apply(function() {
                  scope.place = selectedPlace;
                  console.log('PlacesAutocomplete(): Changed the value');
                  controller.$setViewValue(element.val());
              });
            }
          }

          controller.$render = function () {
            var location = controller.$viewValue;
            element.val(location);
          };
      }
    };
  }]);
