// Some utility functions used in the application
"use strict";

String.prototype.sFormat = function () {
    //Usage: "string {str1} {placeholder2} [plac3]".sFormat(12,21,1);

    var index = 0;
    var formatArray = arguments;
    return this.replace(/{[^{}]+}/g, function (key) {
        return formatArray[index++] || "";
    });
};

String.format = function () {
    //Usage: String.format("string {str1} {placeholder2} [plac3]",1,2,3);

    var params = Array.prototype.slice.call(arguments);
    var str = params.shift();
    return String.prototype.sFormat.apply(str, params);
};

String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length) {
        str = padString + str;
    }
    return str;
};

String.prototype.rpad = function (padString, length) {
    var str = this;
    while (str.length < length) {
        str = str + padString;
    }
    return str;
};