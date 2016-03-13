'use strict';

angular.module('planz.directives')
    .directive('pzConversation', [function () {
        return {
            restrict: 'EA',
            scope: {
                conversation: '='
            },
            controller: 'MessageConversationController',
            templateUrl: 'js/directives/pz_conversation.html',
            link: function (scope, element, attrs) {
            }
        };
    }]);
