"use strict";

angular.module('planz.services').
    service('MessagingService', ['$rootScope', '$http', '$q', '$timeout', '$filter', '$window', 'ApiUrlValues', function ($rootScope, $http, $q, $timeout, $filter, $window, ApiUrlValues) {


        function decorateMessagePictures(listingItem) {
            // profile-placeholder.png
            if (true === angular.isUndefined(listingItem)) {
                return;
            }

            if (listingItem.doNotDecorate !== true) {
                if (listingItem.messageAttachment) {
                    listingItem.messageAttachment.imageUrl = $window.serverUrl + '/v1/message/attachment/' + listingItem.messageAttachment.id;
                }
            }

            if (false === angular.isUndefined(listingItem.replies)) {
                listingItem.replies.map(decorateMessagePictures);
            }

            if (false === angular.isUndefined(listingItem.firstMessage)) {
                decorateMessagePictures(listingItem.firstMessage);
            }

            if (false === angular.isUndefined(listingItem.lastMessage)) {
                decorateMessagePictures(listingItem.lastMessage);
            }
        }

        /**
         * Returns the list of messages for the authenticated user
         *
         * @param total
         * @returns {Deferred.promise|*}
         */
        this.getMessagesList = function (messageId) {
            var deferred = $q.defer();
            var serviceUrl = ApiUrlValues.ConversationsListing;
            if (messageId) {
                serviceUrl = String.format(ApiUrlValues.ConversationListing, messageId);
            }

            $http.get(serviceUrl)
                .success(function (data) {
                    data.map(decorateMessagePictures);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the message with the given identifier
         *
         * @param id    the message id
         * @returns {Deferred.promise|*}
         */
        this.getMessageById = function (id) {
            var deferred = $q.defer();

            $http.get(String.format(ApiUrlValues.ConversationListing, id))
                .success(function (data) {
                    data.map(decorateMessagePictures);
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Send or create a new message
         *
         * @param message       the actual message
         * @param recipients    the list of recipients of the message
         */
        this.sendMessage = function (message, recipients, attachments) {
            var deferred = $q.defer();
            attachments = attachments || [];

            var attachmentIds = $filter('pluck')(attachments, 'id');

            var data = {
                "message": message,
                "recipients": recipients,
                "attachments": attachmentIds
            };

            $http.post(ApiUrlValues.CreateMessage, data)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Reply to an existing conversation
         *
         * @param conversationId  the conservation identifier
         * @param message         the reply message
         * @param attachments     the attachments
         * @returns {*}
         */
        this.replyMessage = function (conversationId, message, attachments) {
            var deferred = $q.defer();
            attachments = attachments || [];

            var attachmentIds = $filter('pluck')(attachments, 'id');

            var data = {
                "message": message,
                "conversation": conversationId,
                "attachments": attachmentIds
            };

            $http.put(String.format(ApiUrlValues.ReplyMessage, conversationId), data)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
