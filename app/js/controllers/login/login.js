'use strict';


angular.module('planz.controllers').
    controller('LoginController', ['$scope', '$stateParams', '$http', '$location', '$window', 'LoginService', 'SessionService', '$state', function ($scope, $stateParams, $http, $location, $window, LoginService, SessionService, $state) {
        console.log("Login controller");

        $scope.validateEmail = false;

        $scope.scenario = $stateParams.scenario;
        if ($stateParams && $stateParams.scenario === 'already') {
            $scope.email = $stateParams.email;
            $scope.title = 'Your email is already registered.<br/>Do you want to log in?';
        } else {
            $scope.title = 'Log In';
        }

        $scope.isEmailValid = function () {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test($scope.email);
        };

        $scope.login = function () {
            $scope.accountNotConfirmed = false;
            $scope.wrongCredentials = false;
            var lowerEmail = $scope.email.toLowerCase();
            $scope.$root.loading = 1;
            LoginService.login(lowerEmail, $scope.password, $scope.loginRememberMe).then(
                function (data) {

                    var redirect = LoginService.getRedirectAfterLogin();
                    if (redirect) {
                        $scope.$root.$broadcast('login');

                        // Go to previous set redirect
                        $state.go('map');
                        LoginService.redirectAfterLogin(false);
                    } else {
                        $scope.$root.$broadcast('login');

                        // Go to map page
                        $state.go('map');
                    }
                    $scope.$root.loading = 0;


                }, function (data) {
                    var err = data.error;
                    var errorStatus = data.httpStatus;

                    switch (errorStatus){
                    	case 401:
	                    	var errorReason = "Unknown Error";
		                    if(err.error!=null && err.error.msg!=null){
		                    	errorReason = err.error.msg;
		                    }
		                    if(errorReason === 'User is not confirmed') {
	                        	$scope.accountNotConfirmed = true;
	                    	}else{
	                    		$scope.wrongCredentials = true;
	                    	}
                    	break;
                    	case 404:
                    		$window.alert("We could not connect to the server. Please try again");
                    	break;
                    	case 500:
                    		$window.alert("Oops we have had an issue. Please try again soon");
                    	break;
                    	default:
                    		$window.alert("An error has occurred. Please check your refresh this page to continue");
                    	break;
                    }
                    $scope.$root.loading = 0;

                }
            );
        };

        $scope.cancel = function () {
            if ($scope.scenario === 'active') {
                $state.go('home');
                return;
            }

            $window.history.back();
        };

        $scope.validate = function () {
            return $scope.isEmailValid() &&
            $scope.password;
        };
    }]);
