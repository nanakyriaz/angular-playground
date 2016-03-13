'use strict';

angular.module("planz.directives")
    .directive("popoverHtmlUnsafePopup", ['$window', function ($window) {
        return {
            restrict: "EA",
            replace: true,
            scope: {title: "@", content: "@", placement: "@", animation: "&", isOpen: "&"},
            templateUrl: "js/directives/pz_tooltip.html",
            link: function (scope, element, attrs) {

                scope.shareTwitter = function () {
                    $window.open('https://twitter.com/share?text="' + document.title + '"&via=planzheroes&url=' + encodeURIComponent(document.URL), 'twitter-share', 'width=500,height=300');
                };
                scope.shareFacebook = function () {
                    $window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL), 'facebook-share', 'width=500,height=300');
                };
            }
        };
    }])
    .directive("popoverHtmlUnsafe", ["$tooltip", function ($tooltip) {
        return $tooltip("popoverHtmlUnsafe", "popover", "click");
    }]);