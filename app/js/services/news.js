"use strict";

angular.module('planz.services').
    service('NewsService', ['$rootScope', '$http', '$q', '$timeout', 'ApiUrlValues', function ($rootScope, $http, $q, $timeout, ApiUrlValues) {

        /**
         * Returns all the news items
         *
         * @returns {Deferred.promise|*}
         */
        this.getNewsList = function (limit) {
            var deferred = $q.defer();
            limit = limit || 4;

            $http.get(ApiUrlValues.NewsListing, {params: {"limit": limit, "sort": "createdAt DESC"}})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        /**
         * Returns the news item with the given identifier
         *
         * @param id    the identifier of the wanted item
         * @returns {Deferred.promise|*}
         */
        this.getNewsById = function (id) {
            var deferred = $q.defer();
            id = parseInt(id);

            $http.get(String.format(ApiUrlValues.NewsDisplay, id))
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
            $http.post(ApiUrlValues.NewsListing, content)
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
            $http.put(String.format(ApiUrlValues.NewsDisplay, id), content)
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

            $http['delete'](String.format(ApiUrlValues.NewsDisplay, id))
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };
    }]);
