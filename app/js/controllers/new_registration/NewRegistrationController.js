(function() {
'use strict';


angular.module('planz.controllers').
    controller('NewRegistrationController', ['$rootScope', '$modal', '$timeout', '$scope', '$state', 'CheckStateChangeService', 'AddressLookupService', function ($rootScope, $modal, $timeout, $scope, $state, CheckStateChangeService, AddressLookupService) {
    init();
    
    console.log("Registration controller instantiated");
    initRegistration();

    function initRegistration(){
      var registration = {
        type: 'none',
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

        /*"firstName":"123","lastname":"123","name":"123","phone":"123","phoneExtension":"321","mobile":"123","email":"123123","password":"231213","confirmation":"231231","pcMobile":"321","pcLastName":"231","pcEmail":"213","pcFirstName":"213", "pcPhone":"asdasd","pcPhoneExtension":"asd"*/
      }; //registration data
      $scope.registration = registration;
      $scope.loading = false;
    }
    
    $scope.go = function(state){
      $state.go(state);
    };
    
    $scope.back = function(){
      var nextState = 'newregistration.newaccount';
      switch($state.current.name) { 
        case 'newregistration.address':
          nextState = 'newregistration.newaccount'; break;
        case 'newregistration.addressDetails':
          nextState = 'newregistration.address'; break;  
        case 'newregistration.donation':
          if ($scope.registration.addressManual.streetname){
            nextState = 'newregistration.addressDetails';
          } else {
            nextState = 'newregistration.address'; 
          }
          break;
        case 'newregistration.finish':
          nextState = 'newregistration.donation'; break;
      }
      $state.go(nextState, {skipValidation:true});
    };
    
    $scope.next = function(){
      var nextState = 'newregistration.newaccount';
      switch($state.current.name) {
        case 'newregistration.newaccount':
          nextState = 'newregistration.address'; break;
        case 'newregistration.address':
          nextState = 'newregistration.donation'; break;
        case 'newregistration.addressDetails':
          nextState = 'newregistration.donation'; break;
        case 'newregistration.donation':
          nextState = 'newregistration.finish'; break;
      }
      $state.go(nextState);
    };
    
    $scope.register = function(){
      //call registration process
      $state.go('newregistration.done');
    };
    
    $scope.reset = function(){
      if ($scope.step>1){
        initRegistration();
        $state.go('newregistration.newaccount');
      }
      $scope.disableType = true;
    };
    
    function init(){
      CheckStateChangeService.checkFormOnStateChange($scope);
      $scope.step = $state.current.data.step || 1;
    }
    
    $scope.findAddress = function(postcode){
      console.log(postcode);
      $scope.loading = true;
      $timeout(angular.noop, 2000)
      .then(function(){
        if (!$scope.loading) {
          return; //cancelled by the user
        }
        $scope.addressResults = AddressLookupService.get(postcode);
        if ($scope.addressResults && $scope.addressResults.length>0){
          $scope.registration.address = $scope.addressResults[0];
          $scope.registration.addressManual = {};
        }
        $scope.loading = false;
      });
    };
    
    $scope.resetAddressResults = function(){
      $scope.addressResults = undefined;
      $scope.registration.address = undefined;
    };

    $scope.manualAddress = function(){
      $scope.registration.address = {};
      $scope.addressResults = undefined;
      $state.go("newregistration.addressDetails", {skipValidation:true});
    };
    
    $scope.cancelLoading = function(){
      $scope.loading = false;
      $scope.resetAddressResults();
    };
    
    $scope.showSelectedAddress = function(index){
      $scope.registration.address = $scope.addressResults[index]; 
    };

    $scope.displayAccountInfoPopup = function(){
      $rootScope.modalInstance = $modal.open({
          templateUrl: 'js/views/overlays/profileTypes.html',
          windowClass: 'standard-window',
          controller: function ($scope, $modalInstance) {
              $scope.close = function () {
                  $modalInstance.dismiss();
              };
          }
      });
    };

    $scope.selectAll = function(type){
      if (!type){
        return;
      }
      setArrays($scope.registration[type], true);
    }; 

    function setArrays(array, value, toggle){
      for(var i=0, ii=array.length; i<ii; i+=1){
        if (angular.isArray(array[i])){
          for(var j=0,jj=array[i].length; j<jj; j+=1){
            if (toggle) {
              array[i][j] = !array[i][j];
            } else {
              array[i][j] = value;
            }
          }
        } else {
          if (toggle) {
            array[i] = !array[i];
          } else {
            array[i] = value;
          }
        }
      }
    }

    $scope.navigateToGetStarted = function(){
      //TODO: add correct state to get started
      $state.go('login');
    };

    $scope.sendInvite = function(email){
      if (!email) {
        return;
      }
      //TODO: send invite
    };
    
  }]);

})();