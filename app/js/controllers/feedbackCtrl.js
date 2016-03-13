"use strict";

angular.module('planz.controllers').
    controller("FeedbackController", [ '$scope', 'FeedbackService',
        function($scope, FeedBackService) {

            /**
             *
             * @type {boolean}
             */
            $scope.content = false;

            /**
             *
             * @returns {boolean}
             */
            $scope.validate = function() {
                // check whether it's a valid email address
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var result = false;

                if ($scope.feedback){
                    result = re.test($scope.feedback.email);
                }

                if (result) {
                    $scope.feedbackForm.email.$setValidity('email', true);
                } else {
                    $scope.feedbackForm.email.$setValidity('email', false);
                }

                return $scope.feedbackForm.$valid || false;
            };

            /**
             *
             * @param feedback
             */
            $scope.submitFeedback = function(feedback){
                // check whether fields are filled in
                console.log('feedbackForm: ', $scope.feedbackForm);
                FeedBackService.createFeedback(feedback).then(function(){
                    // Done
                    $scope.content = false;
                });
            };
        }]);
