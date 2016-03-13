'use strict';

angular.module('planz.directives')
    .directive('pzTimepicker', [function () {
        return {
            require: '^ngModel',
            replace: false,
            template: '<select ng-model="selectedOption" ng-change="valueChanged()" ng-options="item.name as item.name for item in timeIntervals"><option value="">Not Set</option></select>',
            restrict: 'EA',
            scope: {
                selectedTime: '=ngModel',
                onTimeChanged: '&'
            },
            link: function (scope, elem, attrs, ngModelCtrl) {
                scope.timeIntervals = [
                    {value: '0000', name:'00:00'},
                    {value: '0015', name:'00:15'},
                    {value: '0030', name:'00:30'},
                    {value: '0045', name:'00:45'},

                    {value: '0100', name:'01:00'},
                    {value: '0115', name:'01:15'},
                    {value: '0130', name:'01:30'},
                    {value: '0145', name:'01:45'},

                    {value: '0200', name:'02:00'},
                    {value: '0215', name:'02:15'},
                    {value: '0230', name:'02:30'},
                    {value: '0245', name:'02:45'},

                    {value: '0300', name:'03:00'},
                    {value: '0315', name:'03:15'},
                    {value: '0330', name:'03:30'},
                    {value: '0345', name:'03:45'},

                    {value: '0400', name:'04:00'},
                    {value: '0415', name:'04:15'},
                    {value: '0430', name:'04:30'},
                    {value: '0445', name:'04:45'},

                    {value: '0500', name:'05:00'},
                    {value: '0515', name:'05:15'},
                    {value: '0530', name:'05:30'},
                    {value: '0545', name:'05:45'},

                    {value: '0600', name:'06:00'},
                    {value: '0615', name:'06:15'},
                    {value: '0630', name:'06:30'},
                    {value: '0645', name:'06:45'},

                    {value: '0700', name:'07:00'},
                    {value: '0715', name:'07:15'},
                    {value: '0730', name:'07:30'},
                    {value: '0745', name:'07:45'},

                    {value: '0800', name:'08:00'},
                    {value: '0815', name:'08:15'},
                    {value: '0830', name:'08:30'},
                    {value: '0845', name:'08:45'},

                    {value: '0900', name:'09:00'},
                    {value: '0915', name:'09:15'},
                    {value: '0930', name:'09:30'},
                    {value: '0945', name:'09:45'},

                    {value: '1000', name:'10:00'},
                    {value: '1015', name:'10:15'},
                    {value: '1030', name:'10:30'},
                    {value: '1045', name:'10:45'},

                    {value: '1100', name:'11:00'},
                    {value: '1115', name:'11:15'},
                    {value: '1130', name:'11:30'},
                    {value: '1145', name:'11:45'},

                    {value: '1200', name:'12:00'},
                    {value: '1215', name:'12:15'},
                    {value: '1230', name:'12:30'},
                    {value: '1245', name:'12:45'},

                    {value: '1300', name:'13:00'},
                    {value: '1315', name:'13:15'},
                    {value: '1330', name:'13:30'},
                    {value: '1345', name:'13:45'},

                    {value: '1400', name:'14:00'},
                    {value: '1415', name:'14:15'},
                    {value: '1430', name:'14:30'},
                    {value: '1445', name:'14:45'},

                    {value: '1500', name:'15:00'},
                    {value: '1515', name:'15:15'},
                    {value: '1530', name:'15:30'},
                    {value: '1545', name:'15:45'},

                    {value: '1600', name:'16:00'},
                    {value: '1615', name:'16:15'},
                    {value: '1630', name:'16:30'},
                    {value: '1645', name:'16:45'},

                    {value: '1700', name:'17:00'},
                    {value: '1715', name:'17:15'},
                    {value: '1730', name:'17:30'},
                    {value: '1745', name:'17:45'},

                    {value: '1800', name:'18:00'},
                    {value: '1815', name:'18:15'},
                    {value: '1830', name:'18:30'},
                    {value: '1845', name:'18:45'},

                    {value: '1900', name:'19:00'},
                    {value: '1915', name:'19:15'},
                    {value: '1930', name:'19:30'},
                    {value: '1945', name:'19:45'},

                    {value: '2000', name:'20:00'},
                    {value: '2015', name:'20:15'},
                    {value: '2030', name:'20:30'},
                    {value: '2045', name:'20:45'},

                    {value: '2000', name:'21:00'},
                    {value: '2115', name:'21:15'},
                    {value: '2130', name:'21:30'},
                    {value: '2145', name:'21:45'},

                    {value: '2200', name:'22:00'},
                    {value: '2215', name:'22:15'},
                    {value: '2230', name:'22:30'},
                    {value: '2245', name:'22:45'},

                    {value: '2300', name:'23:00'},
                    {value: '2315', name:'23:15'},
                    {value: '2330', name:'23:30'},
                    {value: '2345', name:'23:45'}
                ];


                /**
                 * Invoked when the time interval has changed in the combobox
                 */
                scope.valueChanged = function() {
                    if (!scope.selectedOption) {
                        scope.selectedOption = "";
                    }

                    var selectedDateTime = null;
                    var timeElements = scope.selectedOption.split(':');
                    if (timeElements && timeElements.length > 0) {
                        var hours = parseInt(timeElements[0], 10),
                            minutes = parseInt(timeElements[1], 10);

                        selectedDateTime = new Date();
                        selectedDateTime.setHours(hours);
                        selectedDateTime.setMinutes(minutes);
                    }

                    ngModelCtrl.$setViewValue(selectedDateTime);

                    scope.onTimeChanged();
                };

                function generateItemValue(dateTime) {
                    if (!dateTime) {
                        return null;
                    }

                    return dateTime.getHours().toString().lpad('0', 2) + ':' + dateTime.getMinutes().toString().lpad('0', 2);
                }

                // get the current time
                scope.selectedOption = generateItemValue(scope.selectedTime);
            }
        };
    }]);
