"use strict";

angular.module('planz.services').
    service('NotificationService', ['$rootScope', '$http', '$q', 'ApiUrlValues', function ($rootScope, $http, $q, ApiUrlValues) {

        var me = this;
        me.notifications = null;
        me.firstCall = true;

        /**
         * Retrieve the notifications
         */
        this.getNotificationsJustOnce = function(){
            if (me.firstCall)
            {
                me.firstCall = false;
                this.getNotifications();
            }
        };

        /**
         * Returns the number of unread notifications
         *
         * @returns {*}
         */
        this.getNotificationsCount = function (){
            if (me.notifications === null){
                me.getNotificationsJustOnce();
                return 0;
            }

            return me.notifications.length;

        };

        /**
         * Returns the number of unread notifications
         */
        this.getNotifications = function() {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.UnreadNotifications)
                .success(function (data) {
                    me.notifications = data;
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        /**
         * Returns the status of unread notifications
         */
        this.getNotificationStatus = function() {
            var deferred = $q.defer();

            $http.get(ApiUrlValues.NotificationsStatus)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };
        /**
         * Mark all the user notifications as read
         * @returns {*}
         */
        this.markAllNotifications = function(notificationGroup) {
            var deferred = $q.defer();

            var data = {};
            if (notificationGroup) {
              data.notificationGroup = notificationGroup;
            }
            $http.put(ApiUrlValues.MarkUnreadNotifications, data)
              .success(function () {
                deferred.resolve();
              }).error(function (err) {
                deferred.reject(err);
              });

            return deferred.promise;
        };

        /**
         * Mark all the food donation related user notifications as read
         *
         * @returns {*}
         */
        this.markAllDonationNotifications = function() {
            var deferred = $q.defer();

            $http.put(ApiUrlValues.MarkDonationNotifications)
                .success(function () {
                    deferred.resolve();
                }).error(function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        /**
         * Remove the notification with the given identifier
         *
         * @param notificationId    the identifier of the notification
         */
        this.removeNotification = function (notificationId){
            for (var i in me.notifications){
                if (me.notifications[i].id === notificationId){

                    me.notifications.splice(i,1);
                    return;
                }
            }
        };

        /**
         * Returns the total number of notifications of the given type
         *
         * @param type  the notification type
         * @returns {number}
         */
        this.getCountByType = function (type){
            if (me.notifications === null){
                me.getNotificationsJustOnce();
                return 0;
            }

            var sum = 0;
            me.notifications.map(function(notification){
                if (notification.type.indexOf(type)!==-1) {
                    sum++;
                }
            });
            return sum;
        };
    }]);
