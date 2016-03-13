(function() {
'use strict';


angular.module('planz.controllers').
    controller('NewProfileUpdateController', ['$rootScope', '$modal', '$timeout', '$scope', '$state', 'AddressService', function ($rootScope, $modal, $timeout, $scope, $state,  AddressService) {
    
    console.log("New Profile Update controller instantiated");
    
    //profile object = registration (view)
    //   loaded during route resolve in userProfile
    //profileStatus.progress

    //profile picture dependencies
    // selectedItem.avatar
    // selectedItem.fullName
    // imageUrl

    var registration = {
      type: 'business',
      primaryContact: true,
      collectionTimes: [
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false]
      ],
      donationFoodTypes: [
        [false, false, false],
        [false, false],
        [false, false],
        [false, false, false],
        [false, false],
        [false, false, false],
        [false, false],
        [false, false, false],
        [false, false, false],
      ],
      roleTypes: [false, false, false],
      volunteerFoodTypes: [false, false, false],
      transporterFoodTypes: [false, false, false, false],
      addressManual: {},

      "firstName":"123","lastname":"123","name":"123","phone":"123","phoneExtension":"321","mobile":"123","email":"123123","password":"231213","confirmation":"231231","pcMobile":"321","pcLastName":"231","pcEmail":"213","pcFirstName":"213", "pcPhone":"asdasd","pcPhoneExtension":"asd"
    }; //registration data
    $scope.registration = registration;

    $scope.save = function(){

    };

    $scope.cancel = function(){

    };
    
  }]);

})();