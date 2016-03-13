/*jshint asi:true, boss:true, expr: true   */

var analytics = angular.module('analytics', []);

analytics.constant( 'gaKey', 'UA-55668966-1' );

analytics.run(['$window','$location','$rootScope','gaKey', function($window, $location, $rootScope, gaKey) {

  /* jshint ignore:start */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })($window,$window.document,'script','//www.google-analytics.com/analytics.js','ga');
  /* jshint ignore:end */

  $window.ga('create', gaKey);

  var track = function() {
    $window.ga('send', 'pageview', {
      location:  $location.absUrl(),
      page : $location.url()
    });
  };

  $rootScope.$on('$viewContentLoaded', track);
}]);

analytics.service('analytics', ['$window',function($window) {
  return {
    trackEvent: function(action, label, value) {
      $window.ga('send', 'event', action, label, value);
    }
  };

}]);
