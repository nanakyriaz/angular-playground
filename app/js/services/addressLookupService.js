(function() {
'use strict';

/**
 * Home Controller
 */
angular
  .module('planz.services')
  .factory('AddressLookupService', function () {
    console.log("Address Service instantiated");

    var results = [
      { 
        streetname: '1 Rosebery Avenue',
        city: 'London',
        postcode: 'EC11 BB'
      },
      { 
        streetname: '2 Rosebery Avenue',
        city: 'London',
        postcode: 'EC11 BB'
      }
    ];
    
    function get(postcode){
      //transform results to application
      results.map(function(item){
        return {
          streetname: item.streetname,
          city: item.city,
          postcode: item.postcode
        };
      });
      return results;
    }
    
    return {
      get: get
    };
});

})();