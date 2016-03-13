'use strict';

angular.module('planz.directives')
    .directive('pzMyCommunitiesTab', ['$filter', function ($filter) {
        return {
            restrict: 'EA',
            scope: {
                tabName: '=',
                profileType: '=',
                activeSection: '=',
                communityItems: '=',
                updatedSearchTerm: '=',
                profileItems: '='
            },
            templateUrl: 'js/directives/pz_myCommunities_tab.html',
            link: function (scope, element, attrs) {
                var tabItems = $filter('profileItemsForType')(scope.communityItems, scope.profileType);
                scope.isEmptyList = tabItems.length === 0;
            }
        };
    }]);
