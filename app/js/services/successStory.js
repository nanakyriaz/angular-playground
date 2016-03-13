"use strict";

angular.module('planz.services').
    service('SuccessStoryService', ['$rootScope', '$http', '$q', '$timeout', 'ApiUrlValues', function ($rootScope, $http, $q, $timeout, ApiUrlValues) {

        /**
         * Returns all the success story items
         *
         * @returns {Deferred.promise|*}
         */
        this.getSuccessStoryList = function (limit) {
            var deferred = $q.defer();
            limit = limit || 4;

            $http.get(ApiUrlValues.SuccessStoryListing, {params: {"limit": limit, "sort": "createdAt DESC"}})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns all the success story items
         *
         * @returns {Deferred.promise|*}
         */
        this.getSuccessStoryFrontList = function (limit) {
            var deferred = $q.defer();
            limit = limit || 4;

            $http.get(ApiUrlValues.SuccessStoryFrontListing, {params: {"limit": limit, "sort": "createdAt DESC"}})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the success story item with the given identifier
         *
         * @param id    the identifier of the wanted item
         * @returns {Deferred.promise|*}
         */
        this.getSuccessStoryById = function (id) {
            var deferred = $q.defer();
            id = parseInt(id);

            $http.get(String.format(ApiUrlValues.SuccessStoryDisplay, id))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         *
         * @param content
         * @returns {*}
         */
        this.createItem = function(content) {
            var deferred = $q.defer();

            console.log('SuccessStoryService.createItem(), content: ', content);
            $http.post(ApiUrlValues.SuccessStoryListing, content)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         *
         * @param content
         * @returns {*}
         */
        this.createOrUpdateItem = function(content) {
            console.log('SuccessStoryService.createOrUpdateItem()');
            if (content.hasOwnProperty('id')) {
                console.log('Updating content');
                return this.updateItem(content.id, content);
            }

            return this.createItem(content);
        };

        /**
         *
         * @param id
         * @param content
         * @returns {*}
         */
        this.updateItem = function(id, content) {
            var deferred = $q.defer();
            id = parseInt(id, 10);

            console.log('SuccessStoryService.updateItem(), content: ', content);
            $http.put(String.format(ApiUrlValues.SuccessStoryDisplay, id), content)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Deletes the success story with the given identifier
         *
         * @param id    the identifier of the deletable item
         * @returns {*}
         */
        this.deleteItem = function (id) {
            var deferred = $q.defer();
            id = parseInt(id);

            $http['delete'](String.format(ApiUrlValues.SuccessStoryDisplay, id))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
