"use strict";

angular.module('planz.controllers').
    controller('MessageConversationController', ['$scope', '$rootScope', '$stateParams', '$location', '$anchorScroll', '$upload', '$window', 'MessagingService', 'ApiUrlValues',

        function ($scope, $rootScope, $stateParams, $location, $anchorScroll, $upload, $window, MessagingService, ApiUrlValues) {

            var self = this;

            /**
             * Stores the number of items to show per page
             *
             * @type {number}
             */
            var itemsPerPage = $scope.itemsPerPage = 3;

            // do stuff for filtering...
            $scope.maximumMessageLength = 400;
            $scope.availableCharacters = $scope.maximumMessageLength;
            $scope.messageAttachments = [];
            $scope.validMessage = false;
            $scope.viewLimit = itemsPerPage; // by default show the three most recent message
            $scope.numberOfAvailableMessages = 0;
            $scope.buttonLabel = "Send";

            /**
             * Reply the message to the back-end
             */
            $scope.replyMessage = function () {
                var message = $scope.message;

                $scope.validMessage = false;
                $scope.buttonLabel = "Sending...";

                MessagingService.replyMessage($scope.conversation.id, message, $scope.messageAttachments)
                    .then(function (conversation) {
                        $scope.validMessage = true;
                        $scope.buttonLabel = "Send";
                        $scope.reloadMessages(true);
                     })
                    ['catch'](function(err) {
                        $scope.validMessage = false;
                        $scope.buttonLabel = "Send";
                        if (err.error === 'No message given.') {
                          // mark message as invalid
                          $scope.messageForm.message.$setValidity('required', false);
                        }
                    });
            };

            /**
             * Clear the content of the message form
             */
            $scope.clearMessageForm = function () {
                $scope.message = '';
                $scope.clearMessageAttachments();
            };

            /**
             * Clear the message attachment
             *
             * @param attachment    the message attachment
             */
            $scope.clearMessageAttachment = function (attachment) {
                console.log('MessageConversationController.clearMessageAttachment() attachment: ', attachment);
                var index = $scope.messageAttachments.indexOf(attachment);
                $scope.messageAttachments.splice(index, 1);
            };

            /**
             * Clear the associated message attachments
             */
            $scope.clearMessageAttachments = function () {
                $scope.messageAttachments = [];
            };

            /**
             * Upload a message attachment
             */
            $scope.onFileSelect = function (files) {
                console.log('MessageConversationController.onFileSelect()');
                var uploadProgress = function uploadProgress(evt) {
                    console.log('MessageConversationController.onFileSelect.uploadProgress(), arguments: ', arguments);
                    var percentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.validMessage = false;
                };
                var uploadSuccess = function uploadSuccess(data, status, headers, config) {
                    console.log('MessageConversationController.onFileSelect.uploadSuccess(), arguments: ', arguments);
                    if (data && status === 201) {
                        data.imageUrl = $window.serverUrl + '/v1/message/attachment/' + data.id;
                        console.log('Adding the message attachment: ', data);
                        $scope.messageAttachments.push(data);
                    }

                    console.log('MessageAttachments: ', $scope.messageAttachments);
                    $scope.validMessage = $scope.validateMessage();
                };

                var uploadError = function(data, status, headers, config){
                    console.log("UPLOAD FAILED");
                    if(arguments[0].error!=null){
                        $window.alert(arguments[0].error);
                    }
                };

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log('MessageConversationController.onFileSelect(), file: ', file);

                    $scope.upload = $upload.upload({
                        url: String.format(ApiUrlValues.UploadMessageAttachment, $scope.conversation.id),
                        method: 'POST',
                        data: {
                            conversationId: $scope.conversation.id
                        },
                        file: file
                    }).progress(uploadProgress)
                        .success(uploadSuccess)
                        .error(uploadError);
                }
            };

            /**
             * Reload the messages
             */
            $scope.reloadMessages = function (displayAllMessages) {
                console.log('MessageConversationController.reloadMessages(), displayAllMessages: %s', displayAllMessages);
                displayAllMessages = displayAllMessages || false;

                if (!$scope.conversation) {
                    return;
                }

                // get all the messages for the conversation
                MessagingService.getMessagesList($scope.conversation.id).then(function (conversations) {
                    console.log('Retrieved the list of messages for this conversation. (displayAllMessages=%s', displayAllMessages);
                    if (conversations.length !== 1) {
                        console.warn('Unexpectedly multiple conversations received. Stopping.');
                        return;
                    }

                    $scope.conversation = conversations[0];
                    console.log('Conversation: ', $scope.conversation);

                    if (displayAllMessages) {
                        console.log('The `displayAllMessages`-flag has been enabled. Setting `viewLimit` to total messages of the conversation.');
                        $scope.viewLimit = $scope.conversation.replies.length;
                    }

                    $scope.numberOfAvailableMessages = $scope.getAvailableMessages();
                    $scope.clearMessageForm();

                    console.log('conversations: ', conversations[0]);

                });
            };

            /**
             * Refresh the message visual element
             */
            $scope.refreshMessage = function () {
                var messageLength = $scope.message ? $scope.message.length : $scope.maximumMessageLength;
                $scope.availableCharacters = $scope.maximumMessageLength - messageLength;

                $scope.validateMessage();
            };

            /**
             * Returns the number of available messages
             *
             * @returns {number}
             */
            $scope.getAvailableMessages = function () {
                if (!$scope.conversation) {
                    return 0;
                }

                var totalReplies = $scope.conversation.replies.length;
                var availableMessages = ( totalReplies - $scope.viewLimit ) - 1;
                return $scope.conversation.replies ? availableMessages : 0;
            };

            /**
             * Returns whether more messages of the conversation is available
             *
             * @returns {boolean}
             */
            $scope.hasMoreItemsToShow = function () {
                var totalReplies = $scope.conversation.replies.length - 1;
                return (totalReplies > $scope.viewLimit);
            };

            /**
             * Shows more messages of the conversation
             */
            $scope.showMoreItems = function () {
                var delta = $scope.conversation.replies.length - $scope.viewLimit;
                if (true === $scope.hasMoreItemsToShow()) {
                    $scope.viewLimit += delta;
                    $scope.numberOfAvailableMessages = $scope.getAvailableMessages();
                }
            };

            /**
             * Validates the message to meet the requirements
             *
             * @returns {boolean}
             */
            $scope.validateMessage = function () {
                var result = !!$scope.message;
                if ($scope.availableCharacters < 0) {
                    result = false;
                }

                // override validity of the message when it has an attachment
                if ($scope.messageAttachments.length > 0) {
                    result = true;
                }

                $scope.messageForm.message.$setValidity('format', result);
                $scope.validMessage = result;
                return result;
            };

            /**
             * Returns the number of available (hidden) messages of the conversation
             * @type {number}
             */
            $scope.numberOfAvailableMessages = $scope.getAvailableMessages();
        }]);
