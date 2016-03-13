'use strict';

/* Directives */

angular.module('planz.directives', [])

/**
 * Returns the application version
 */
    .directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])

/**
 * Directive to bind some scope method to certain element and key code.
 * Example this directive can be used for is to submit form data from input fields by pressing [enter]
 *
 * Usage example:
 *
 *  <input id="message" name="message" class="form-control" type="text"
 *      key-press="postMessage()"
 *      key-code="13"
 *      ng-model="message.message"
 *  />
 */
    .directive('keyPress', function () {
        return function (scope, element, attributes) {
            element.bind('keydown keypress', function (event) {
                if (event.which === parseInt(attributes.keyCode)) {
                    scope.$apply(function () {
                        scope.$eval(attributes.keyPress, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })

/**
 * Only allow the entering of numeric fields in the element
 */
    .directive('numericOnly', function () {
        return function (scope, element, attrs) {
            var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
            element.bind("keydown", function (event) {
                if ($.inArray(event.which, keyCode) === -1) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onlyNum);
                        event.preventDefault();
                    });
                    event.preventDefault();
                }
            });
        };
    })

/**
 * Simple directive to use "dynamic" templates within your HTML code.
 *
 * Usage example:
 * <template src="your_template"></template>
 */
    .directive('template', function () {
        return {
            restrict: 'E',
            transclude: false,
            scope: true,
            replace: true,
            link: function (scope, element, attrs) {
                scope.getTemplateUrl = function () {
                    return '/partials/' + attrs.src + '.html';
                };
            },
            template: '<div data-ng-include="getTemplateUrl()"></div>'
        };
    })

/**
 * This directive stores modal elements in modalWindow array, so
 * elements can be accessed in main.js confirmOverlay()
 */
    .directive('modalWindow', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                $rootScope.modalWindows = $rootScope.modalWindows || [];
                $rootScope.modalWindows.push(element);
            }
        };
    }])

/**
 * This directive allows scroll the asosciated element to scroll to the bottom of the list
 */
    .directive('scrollBottom', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var list = element[0];
                scope.$watch('scrollToBottom', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        scope.scrollBottom();
                    }
                });

                scope.scrollBottom = function (time) {
                    $timeout(function () {
                        list.scrollTop = list.scrollHeight;
                    }, time || 50);
                };
            }
        };
    }])

/**
 * Validate the file format of the uploaded image
 */
    .directive('validateImage', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
                var fileInput = element.find('input')[0];
                var validModel = attrs.validateImage;

                var error = angular.element('<div class="alert alert-warning">The file you have tried to upload is of a type we are unable to accept. Please choose a different file extension</div>');
                error.css('display', 'none');
                element.append(error);

                angular.element(fileInput).bind('change', function (event) {
                    var fileName = fileInput.value;
                    if (fileName) {
                        var extension = fileName.substring(fileName.lastIndexOf('.'));

                        if (validFileExtensions.indexOf(extension) === -1) {
                            error.css('display', 'block');
                            setValidModel(false);
                        } else {

                            //remove any previous error
                            error.css('display', 'none');
                            setValidModel(true);
                        }
                    }
                });

                //validModel is the model that is set in the element's scope
                //to indicate if selected image is valid
                function setValidModel(value) {
                    scope.$apply(function () {
                        scope[validModel] = value;
                    });
                }
            }
        };
    }])


/**
 * Whenever we want to cancel an event propagation to parent elements
 */
    .directive('stopPropagation', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                element.bind('click', function (event) {
                    if (event) {
                        event.stopPropagation();
                    }
                });
            }
        };
    }])

/**
 * Allows the downloading of PDF documents, by creating a iframe-element and load the given url in there
 */
    .directive('downloadPdf', ['$window', function ($window) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            template: '<span>' +
            '<a class="download" ng-click="download()" ng-if="!downloading">Download PDF</a>' +
            '<a class="download" ng-if="downloading">Downloading</a>' +

            '</span>',
            link: function (scope, element, attrs) {

                var document = $window.document;
                var body = angular.element($window.document.body);

                scope.download = function () {
                    var url = attrs.url;
                    console.log(url);

                    var iframe = angular.element('<iframe>')
                        .attr('src', url)
                        .appendTo('body').load(function () {
                            console.log("loaded");
                            iframe.remove();
                        });

                };

            }
        };
    }])
;