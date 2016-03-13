'use strict';

angular.module('planz.controllers').
    controller('UserController', ['$scope', '$rootScope', 'LoginService', 'SessionService', '$state', '_',
        function ($scope, $rootScope, LoginService, SessionService, $state, _) {

            var vm = this;
            init();


            function init() {

                _.extend(vm, {
                    isLoggedIn: false,
                    userMenuDisplaying: false,
                    user: {},
                    toggleUserButton: userIconClicked,
                    logout: logout
                });

                /**
                 * User details have changed
                 */
                $scope.$on('userChanged', function($event, data) {
                    console.log('UserController.userChanged(), event: ', $event, data);
                    var userData = data[0];
                    processUserData(userData);
                });

                /**
                 * Display the user menu when needed
                 */
                $scope.$on('toggleUserMenu', function($event, mouseEvent) {
                    userIconClicked(mouseEvent);
                });

                /**
                 * Listen to the event indicating a user logged in
                 */
                $scope.$on('userLoggedIn', function($event, data) {
                    console.log('User has been logged in');
                    if (data) {
                        return $scope.$broadcast('userChanged', [data]);
                    }

                    LoginService.refreshSessionProfile().then(function(userData) {
                        $scope.$broadcast('userChanged', [userData]);
                    });
                });


                /**
                 * Listen for change in the user authentication state
                 */
                $scope.$watch(
                    function () {
                        return SessionService.getUserAuthenticated();
                    },
                    function (newValue, oldValue) {
                        $scope.$root.isLoggedIn = newValue; // we need to indicate this on the root scope (sad panda)
                        vm.isLoggedIn = newValue;
                        if (newValue) {
                            console.log('[$watch] Dispatching user logged in event');
                            $rootScope.$broadcast('userLoggedIn');
                        }
                    },
                    true
                );
            }

            /**
             * Process the updated user data
             *
             * @param data  the user data
             */
            function processUserData(data) {
                SessionService.updateCurrentUser(data);
                var currentUserData = SessionService.getCurrentUser(),
                    isAdmin = SessionService.isAdministrator();

                vm.user = currentUserData;
                vm.isAdministrator = isAdmin;
            }

            /**
             * Called when the user clicks on the user icon in the navigation
             *
             * @param mouseEvent    the mouse event
             */
            function userIconClicked(event) {
                console.log('UserController.userIconClicked(), userMenuDisplaying: ', vm.userMenuDisplaying, !!vm.userMenuDisplaying);
                event.preventDefault();
                //event.stopPropagation();

                // check the status
                vm.userMenuDisplaying = !vm.userMenuDisplaying;
                if (vm.userMenuDisplaying) {
                    $(document).on('click', clickWhileDisplayingUsermenu);
                }
            }

            /**
             * Called when the user needs to be logged out
             */
            function logout() {
                console.log('UserController.logout()');
                $rootScope.logout();
            }

            /**
             * Process the click on the user icon
             */
            function clickWhileDisplayingUsermenu() {
                vm.userMenuDisplaying = false;
                $(document).off('click', clickWhileDisplayingUsermenu);
            }
        }]);
