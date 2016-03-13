(function() {
'use strict';


angular.module('planz.controllers').
    controller('NewProfileViewController', ['$rootScope', '$modal', '$timeout', '$scope', '$state', 'AddressService', function ($rootScope, $modal, $timeout, $scope, $state,  AddressService) {
    
    console.log("New Profile View controller instantiated");

    $scope.profileStatus = { 
      progress: 0
    };

    var registration = {
      description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat',
        "type":"volunteer","primaryContact":true,"collectionTimes":[[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true],[true,true,true,true,true,true,true]],"donationFoodTypes":[[true,true,true],[true,true],[true,true],[true,true,true],[true,true],[true,true,true],[true,true],[true,true,true],[true,true,true]],"roleTypes":[true,true,true],"volunteerFoodTypes":[true,true,true],"transporterFoodTypes":[true,true,true,true],"addressManual":{},"firstName":"John","lastname":"Smith","name":"Dinos Grocery","phone":"0201 123 123","phoneExtension":"100","mobile":"0782345123","email":"john.smith@dinos.com","password":"freemeal","confirmation":"freemeal","postcode":"SW1 EC","address":{"streetname":"1 Rosebery Avenue","city":"London","postcode":"EC11 BB"},"foodRegistrationNumber":"898998989898","averageDonation":"1","foodTransportConfirmation":"0","acceptedAgreement":true,"acceptedTerms":true,
        pcEmail: "deborah.ford@gmail.com",pcFirstName: "Deborah",pcLastName: "Ford",pcMobile: "0782321213",pcPhone: "0202 123 123",pcPhoneExtension: "54"
    }; //registration data
    $scope.registration = registration;
    
  }]);

})();