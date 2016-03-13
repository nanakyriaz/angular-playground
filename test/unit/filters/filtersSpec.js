'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
    beforeEach(module('planz.filters'));


    describe('interpolate', function() {
        beforeEach(module(function($provide) {
            $provide.value('version', 'TEST_VER');
        }));


        it('should replace VERSION', inject(function(interpolateFilter) {
            expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
        }));
    });

    describe('join', function() {
        it('should join array to concatenated string when comma token is given', inject(function(joinFilter) {
            expect(joinFilter(['a', 'b', 'c'], ',')).toBe('a,b,c');
        }));

        it('should join array to comma-separator string when no token is given', inject(function(joinFilter) {
            expect(joinFilter(['a', 'b', 'c'])).toBe('a,b,c');
        }));

        it('should join array to concatenated string when empty token is given', inject(function(joinFilter) {
            expect(joinFilter(['a', 'b', 'c'], '')).toBe('abc');
        }));

    });

    describe('pluck', function() {
        var listOfObjects = [
            {"name": "John", "age": 27},
            {"name": "Sarah", "age": 31},
            {"name": "Thomas", "age": 25}
        ];

        it('should return array with all name values', inject(function(pluckFilter) {
            expect(pluckFilter(listOfObjects, "name")).toEqual(["John", "Sarah", "Thomas"]);
        }));

        it('should return array with all age values', inject(function(pluckFilter) {
            expect(pluckFilter(listOfObjects, "age")).toEqual([27, 31, 25]);
        }));
    });

    describe('skipMessageId', function() {
        var listOfMessages = [
            {"name": "John", "id": 1},
            {"name": "Sarah", "id": 2},
            {"name": "Thomas", "id": 3}
        ];

        var expectedMessages = [
            {"name": "Sarah", "id": 2},
            {"name": "Thomas", "id": 3}
        ];

        it('should return given when no message id is given', inject(function(skipMessageIdFilter) {
            expect(skipMessageIdFilter(listOfMessages)).toEqual(listOfMessages);
        }));

        it('should return messages but without message with given id', inject(function(skipMessageIdFilter) {
            expect(skipMessageIdFilter(listOfMessages, 1)).toEqual(expectedMessages);
        }));

        it('should return an empty array when nothing is given', inject(function(skipMessageIdFilter) {
            expect(skipMessageIdFilter()).toEqual([]);
        }));
    });

    describe('profileItemsForType', function() {
        var listOfItems = [
            {"name": "John", "profileType": "business"},
            {"name": "Sarah", "profileType": "business"},
            {"name": "Thomas", "profileType": "charity"}
        ];

        var expectedItems = [
            {"name": "John", "profileType": "business"},
            {"name": "Sarah", "profileType": "business"}

        ];

        it('should return empty array when no parameters are given', inject(function(profileItemsForTypeFilter) {
            expect(profileItemsForTypeFilter()).toEqual([]);
        }));

        it('should return empty array when no profile type is given', inject(function(profileItemsForTypeFilter) {
            expect(profileItemsForTypeFilter(listOfItems)).toEqual([]);
        }));

        it('should return all business profiles when "business" is given', inject(function(profileItemsForTypeFilter) {
            expect(profileItemsForTypeFilter(listOfItems, 'business')).toEqual(expectedItems);
        }));
    });

    describe('capitalizeFirstLetter', function() {

        it('should have first letter capitalised', inject(function(capitalizeFirstLetterFilter) {
            expect(capitalizeFirstLetterFilter('hello')).toBe('Hello');
        }));
    });
});
