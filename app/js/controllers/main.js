'use strict';

angular.module('planz.controllers').
    controller('MainController', ['$scope', '$modal', '$location', '$timeout', '$interval', '$window', '$q', 'analytics', 'LoginService', 'SessionService', '$state', '$rootScope', 'NewsService', 'NotificationService', 'Roles', '$cookies',
        function ($scope, $modal, $location, $timeout, $interval, $window, $q, analytics, LoginService, SessionService, $state, $rootScope, NewsService, NotificationService, Roles, $cookies) {

            $scope.ckns_policy = $cookies.ckns_policy;
            $scope.cookiePolicy = function () {
                $scope.ckns_policy = $cookies.ckns_policy = true;
            };

            ////
            //$scope.isCollapsed = false;

            /**
             * Navigate to the homepage of the site
             * @returns {string}
             */
            $rootScope.navigateToHome = function() {
                var state = 'home';
                if (SessionService.getUserAuthenticated()) {
                  state = 'map';
                }

                $state.go(state);
            };


            /**
             * Listen to navigation changes and verify the permissions of the (when) authenticated user
             */
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){

                    // validate the roles
                    if (toState && toState.roles) {
                        if (true === toState.approvedUserOnly) {
                            console.log('Verifying user is an approved profile...');
                            if (false === SessionService.isApprovedProfile()) {
                                return $state.go('forbidden');
                            }
                        }

                        SessionService.checkACL(toState.roles);
                    }
                }
            );

            ///**
            // * Watch for notifications
            // */
            //var alertsWatcherActive = false;
            //$scope.addAlertsWatcher = function(){
            //    console.log('addAlertsWatcher() has been called!!');
            //    if (true === alertsWatcherActive) {
            //        console.log('addAlertsWatcher() is already active!');
            //        return;
            //    }
            //
            //    $scope.$watch(
            //        function () {
            //            if (SessionService.getUserAuthenticated()){
            //                return NotificationService.getNotificationsCount();
            //            }
            //            else {
            //                return false;
            //            }
            //        },
            //        function (newValue, oldValue) {
            //            console.log('notifications has been retrieved: ', newValue, oldValue);
            //            $scope.counts = {
            //                notificationCount: newValue,
            //                messagesCount: NotificationService.getCountByType('messaging:reply') + NotificationService.getCountByType('messaging:create'),
            //                donationsCount: NotificationService.getCountByType('donation:create') + NotificationService.getCountByType('donation:review'),
            //                friendRequestCount: NotificationService.getCountByType('friend:request')
            //            };
            //            console.log('Notification counts: ', $scope.counts);
            //        },
            //        true
            //    );
            //
            //    alertsWatcherActive = true;
            //};
            //
            //if (SessionService.getUserAuthenticated()) {
            //    LoginService.refreshSessionProfile().then(function() {
            //      $rootScope.$broadcast('login');
            //    });
            //} else {
            //    // NOOP
            //}

            //$scope.$watch(
            //  function () {
            //    return SessionService.getUserAuthenticated();
            //  },
            //  function (newValue, oldValue) {
            //    console.log('MainController.userAuthenticated()', newValue, oldValue);
            //    $scope.$root.isLoggedIn = newValue;
            //    $scope.$root.user = SessionService.getCurrentUser();
            //    $scope.$root.isAdministrator = SessionService.isAdministrator();
            //  },
            //  true
            //);

            //$scope.$on('userChanged', function(event, data) {
            //    console.log('MainController.userChanged(), event: ', event);
            //    var userData = data[0];
            //    SessionService.updateCurrentUser(userData);
            //    $scope.$root.user = SessionService.getCurrentUser();
            //});
            //
            //$scope.$on('login', function(event, data) {
            //    console.log('MainController.login(), event: ', event);
            //    $scope.addAlertsWatcher();
            //});
            //
            //$scope.toggleUserOverlay = function (event) {
            //    if (event) {
            //        event.stopPropagation();
            //    }
            //    $scope.userOverlayVisible = !$scope.userOverlayVisible;
            //};
            //
            //$scope.hideUserOverlay = function () {
            //    $scope.userOverlayVisible = false;
            //};

            $scope.isEmailValid = function () {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test($scope.loginEmail);
            };

            $scope.validateLoginForm = function () {
                return $scope.isEmailValid() &&
                $scope.loginPassword;
            };

            // for SessionService-class
            $rootScope.goLogin = function() {
                $state.go('login');
            };

            // for SessionService-class
            $rootScope.goForbidden = function() {
                $state.go('forbidden');
            };

            $scope.goSignUp = function () {
                $state.go('registration');
            };

            $rootScope.go = function (path) {
                if (path === '/500') {
                    try {
                        $rootScope.modalInstance.dismiss('500 error');
                    } catch (e) {

                    }
                }

                $location.path(path);
            };

            $scope.login = function () {
                $scope.wrongCredentials = false;
                $scope.$root.loading = true;

                LoginService.login($scope.loginEmail, $scope.loginPassword, $scope.loginRememberMe).then(
                    function (data) {
                        $scope.userOverlayVisible = false;
                        $scope.loginEmail = null;
                        $scope.loginPassword = null;
                        $scope.$root.loading = false;
                        $rootScope.$broadcast('userLoggedIn', data);

                        var redirect = LoginService.getRedirectAfterLogin();

                        if (redirect) {
                            // Go to previous set redirect
                            $state.go('map'); 
                            LoginService.redirectAfterLogin(false); 
                        } else {
                            // Go to landing page
                            $state.go('map');
                        }

                    }, function (err) {
                        $scope.wrongCredentials = true;

                    }
                )['finally'](function () {
                        $scope.$root.loading = false;
                    });
            };

            $rootScope.logout = function (path) {
                $scope.$root.loading = true;

                LoginService.logout().then(function () {
                    SessionService.logout();

                    $scope.$root.isLoggedIn = false;
                    $scope.$root.isAdministrator = false;
                    $scope.validateEmail = false;
                    $rootScope.$broadcast('userLoggedOut');

                    if ($scope.userOverlayVisible) {
                        $scope.toggleUserOverlay();
                    }

                    $scope.$root.loading = false;
                    $state.go('home');
                });
            };

            $scope.forgottenPasswordClick = function () {
                $scope.userOverlayVisible = false;
                $state.go('forgotten');
            };

            $scope.reconfirmEmail = function(){
                $scope.userOverlayVisible = false;
                $state.go('email_confirm');
            };

            // Overlays


            /**
             * Displays confirm overlay
             * @param configObject {
             *             btnCancel: "Text appearing in cancel button, default 'No'",
             *             btnConfirm: "Text appearing in confirm button, default 'Yes'",
             *             title: "modals main title (header title)",
             *             mainMessage : "Modal main message (in bold)",
             *             secondaryMessage: "Complementary message bellow main message",
             *             headerIcon: "Set type of header icon (view need to be extended with desired icon)",
             *             btnConfirmType: {
             *                          "danger": If true inverts buttons colours, making confirm button "red" (used when user is confirming a dangerous action)
             *                          }
             *          }
             * @returns a promise which will be resolve when overlay is confirmed
             * or reject when canceled
             *
             */
            $rootScope.confirmOverlay = function (configObject) {

                if (!configObject) {
                    throw "Missing config object for confirmation modal";
                }

                //hideLoginOverlay();

                configObject = configObject || {};
                configObject.btnCancel = configObject.btnCancel || 'No';
                configObject.btnConfirm = configObject.btnConfirm || 'Yes';

                // Hide any visible modal before display confirmation
                // see modalWindow directive for modalWindows array
                angular.forEach($rootScope.modalWindows, function (element) {
                    element.hide();
                });

                function showHiddenModals() {
                    angular.forEach($rootScope.modalWindows, function (element) {
                        element.show();
                    });

                    // This is a hack to make sure modalWindows won't grow infinitelly
                    // Directive observe $destroy won't fire
                    if ($rootScope.modalWindows && $rootScope.modalWindows.length > 10) {
                        $rootScope.modalWindows.splice(0, 5);
                    }
                }

                var modalInstance = $modal.open({
                    templateUrl: 'js/views/overlays/confirm.html',
                    windowClass: 'standard-window',
                    controller: function ($scope, $modalInstance, configObject) {
                        $scope.config = configObject;

                        $scope.confirm = function () {
                            showHiddenModals();
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            showHiddenModals();
                            $modalInstance.dismiss();
                        };
                    },
                    resolve: {
                        configObject: function () {
                            return configObject;
                        }
                    }
                });

                return modalInstance.result;
            };


            /**
             * Displays information overlay
             * @param configObject {
             *             title: "modals main title (header title)",
             *             mainMessage : "Modal main message (in bold)"
             *             secondaryMessage: "Complementary message bellow main message"
             *          }
             * @returns a promise which will be resolve when overlay is closed
             *
             */
            $rootScope.informOverlay = function (configObject) {

                if (!configObject) {
                    throw "Missing config object for confirmation modal";
                }

                //hideLoginOverlay();

                configObject = configObject || {};


                // Hide any visible modal before display confirmation
                // see modalWindow directive for modalWindows array
                angular.forEach($rootScope.modalWindows, function (element) {
                    element.hide();
                });

                function showHiddenModals() {
                    angular.forEach($rootScope.modalWindows, function (element) {
                        element.show();
                    });

                    // This is a hack to make sure modalWindows won't grow infinitelly
                    // Directive observe $destroy won't fire
                    if ($rootScope.modalWindow && $rootScope.modalWindows.length > 10) {
                        $rootScope.modalWindows.splice(0, 5);
                    }
                }

                var modalInstance = $modal.open({
                    templateUrl: 'js/views/overlays/inform.html',
                    windowClass: 'standard-window',
                    controller: function ($scope, $modalInstance, configObject) {
                        $scope.config = configObject;

                        $scope.close = function () {
                            $modalInstance.close();
                        };
                    },
                    resolve: {
                        configObject: function () {
                            return configObject;
                        }
                    }
                });

                return modalInstance.result;
            };

            //HELPERS
            //
            //function hideLoginOverlay() {
            //    $scope.userOverlayVisible = false;
            //}
        }]);
