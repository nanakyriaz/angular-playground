'use strict';

angular.module('planz.controllers').
    controller('MenuController', ['$scope', '$interval', 'LoginService', 'SessionService', 'NotificationService', '$state', '_',
        function ($scope, $interval, LoginService, SessionService, NotificationService, $state, _) {

            var notificationsPromise;
            var vm = this;
            init();

            $scope.$on('$destroy', function() {
                console.log('MenuController.$destroy() called.');
                clearWatcher();
            });

            function init() {

                _.extend(vm, {
                    notifications: {
                        total: 0,
                        donations: 0,
                        messages: 0,
                        friendRequests: 0,
                        deliveryRequests: 0
                    },
                    clearMessages: clearMessages,
                    clearDonations: clearDonations
                });

                /**
                 * Listen to the event indicating a user logged in
                 */
                $scope.$on('userLoggedIn', function($event, data) {
                    // start listening to notifications for the logged in user
                    if (false === SessionService.getUserAuthenticated()) {
                        console.log('MenuController.userLoggedIn(): broadcast the logged-out event');
                        return $scope.$broadcast('userLoggedOut');
                    }

                    console.log('MenuController.userLoggedIn(), token: %s', SessionService.getAuthToken());
                    clearWatcher();
                    updateNotifications();
                    startWatcher();
                });

                /**
                 * Listen to the event indicating a user logs out
                 */
                $scope.$on('userLoggedOut', function($event, data) {
                    // stop listening to notifications for the logged in user
                    console.log('MenuController.userLoggedOut(), token: %s', SessionService.getAuthToken());
                    clearWatcher();
                });
                
            }

            /**
             * Mark all the messages notifications as read
             */
            function clearMessages() {
                NotificationService.markAllNotifications('messaging')
                    .then(function(result) {
                        console.log('Result: ', result);
                        vm.notifications.messages = 0;
                    });
            }

            /**
             * Mark all the donation notifications as read
             */
            function clearDonations() {
                NotificationService.markAllDonationNotifications()
                    .then(function(result) {
                        console.log('Result: ', result);
                        vm.notifications.donations = 0;
                    });
            }

            /**
             *  Start the notifications watcher
             */
            function startWatcher() {
                console.log('startWatcher() notificationsPromise: ', notificationsPromise);
                notificationsPromise = $interval(function notificationWatcher() {
                    console.log('notificationWatcher called');
                    updateNotifications();
                }, 300000, 0, true);
            }

            /**
             * Clear the notifications watcher
             */
            function clearWatcher() {
                console.log('clearWatcher() notificationsPromise: ', notificationsPromise);
                if (notificationsPromise) {
                    $interval.cancel(notificationsPromise);
                }
            }

            /**
             * Update the notifications counter
             */
            function updateNotifications() {
                console.log('MenuController.updateNotifications()');
                NotificationService.getNotificationStatus()
                    .then(function(notifications) {
                        console.log('MenuController.updateNotifications(), notifications: ', notifications);
                        vm.notifications.total = notifications.total || 0;
                        vm.notifications.messages = notifications.messages || 0;
                        vm.notifications.donations = notifications.donations || 0;
                        vm.notifications.friendRequests = notifications.friendRequests || 0;
                        vm.notifications.deliveryRequests = notifications.deliveryRequests || 0;
                    });
            }
        }]);
