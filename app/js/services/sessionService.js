"use strict";

angular.module('planz.services').service('SessionService', ['Roles', '$rootScope', function (Roles, $rootScope) {
    var me = this;
    me.isLoggedIn = null;
    me.memoryStorage = {};

    var isPrivateBrowser = false;

    var testKey = 'tester';
    try {
        // Try and catch quota exceeded errors
        sessionStorage.setItem(testKey, '1');
        sessionStorage.removeItem(testKey);
    } catch (error) {
        if (error.code === DOMException.QUOTA_EXCEEDED_ERR && sessionStorage.length === 0){
            isPrivateBrowser = true;
            console.log("Private Browse");
        } else {
            throw error;
        }
    }

    this.wrapperStorageRemoveItem = function(label){
        if(isPrivateBrowser){
            me.memoryStorage[label] = null;
        }else{
            sessionStorage.removeItem(label);
        }
    };

    this.wrapperStorageSetItem = function(label, value){
        if(isPrivateBrowser){
            me.memoryStorage[label] = value;
        }else{
            sessionStorage.setItem(label, value);
        }
    };

    this.wrapperStorageGetItem = function(label){
        if(isPrivateBrowser){
            return me.memoryStorage[label];
        }else{
            return sessionStorage.getItem(label);
        }
    };

    /**
     * Returns the current user data
     * @returns {*}
     */
    this.getCurrentUser = function () {
        var currentUserData = this.wrapperStorageGetItem("currentUser");
        if(currentUserData!=null){
            return $.parseJSON(currentUserData);
        }else{
            return {userRoles:[]};
        }

    };

    /**
     * Returns the authentication token of the authenticated user
     * @returns {*}
     */
    this.getAuthToken = function () {
        return this.wrapperStorageGetItem("authToken");
    };

    /**
     * Sets the authentication token for the authenticated user
     * @param token the auth token
     */
    this.setAuthToken = function (token) {

        if (false === angular.isString(token)) {
            return this.wrapperStorageRemoveItem('authToken');
        }

        this.wrapperStorageSetItem('authToken', token);
    };

    /**
     * Sets the current user data
     * @param currentUser   the user data
     */
    this.setCurrentUser = function (currentUser) {
        var rolesArray = [];

        // determine the user permissions
        if (currentUser.user && currentUser.user.isAdmin) {
            rolesArray.push('ADMINISTRATOR');
        } else if (currentUser.user && currentUser.user.isModerator) {
            rolesArray.push('MODERATOR');
        }

        // determine the roles of the profile
        if (currentUser.profileType === 'business') {
            rolesArray.push('BUSINESS');
        } else if (currentUser.profileType === 'charity') {
            rolesArray.push('CHARITY');
        } else if (currentUser.profileType === 'volunteer') {
            rolesArray.push('VOLUNTEER');
        } else if (currentUser.profileType === 'transporter') {
            rolesArray.push('TRANSPORTER');
        }

        // determine if the approve is approved or not
        if (true === currentUser.approvedProfile) {
            rolesArray.push('PROFILE_APPROVED');
        } else {
            rolesArray.push('PROFILE_UNAPPROVED');
        }

        // add front-end level property named `userRoles
        currentUser.userRoles = rolesArray;

        this.wrapperStorageSetItem("currentUser", JSON.stringify(currentUser));
    };

    /**
     * Update the current user data with the given data (merging)
     * @param data  mergable user data
     */
    this.updateCurrentUser = function (data) {
        var user = me.getCurrentUser();

        for (var field in data) {
            if (data.hasOwnProperty(field)) {
                user[field] = data[field];
            }
        }
        me.setCurrentUser(user);
    };

    /**
     * Returns whether the user has the given roles
     *
     * @param role  the name of the role
     * @returns {boolean}
     */
    this.checkRole = function (role) {
        var currentUser = this.getCurrentUser();
        if (!currentUser) {
            return false;
        }

        return currentUser.userRoles.indexOf(role) !== -1;
    };

    /**
     * Sets whether the user is authenticated
     * @param value the value
     */
    this.setUserAuthenticated = function (value) {
        this.wrapperStorageSetItem("isLoggedIn", JSON.stringify(value));
        me.isLoggedIn = value;
    };

    /**
     * Returns the user authenticated state
     * @returns {Boolean}
     */
    this.getUserAuthenticated = function () {
        var isUserLoggedInParameter = this.wrapperStorageGetItem("isLoggedIn");
        if (me.isLoggedIn === null && isUserLoggedInParameter!=null) {
            me.isLoggedIn = $.parseJSON(isUserLoggedInParameter);
        }

        return me.isLoggedIn;
    };

    /**
     * Logs out the authenticated user
     */
    this.logout = function () {
        this.setUserAuthenticated(false);
        this.setAuthToken(false);
    };

    /**
     * Navigate to the login-page
     */
    this.navigateToLogin = function() {
        return $rootScope.goLogin(); // TODO get a better way to this without circular dependencies error
    };

    /**
     * Returns whether the user is an administrator
     *
     * @returns {boolean}
     */
    this.isAdministrator = function () {
        return this.isRolesMatches([Roles.administrator]);
    };

    /**
     * Returns whether the user is an approved profile
     *
     * @returns {boolean}
     */
    this.isApprovedProfile = function () {
      return this.isRolesMatches([Roles.approvedProfile]);
    };

    /**
     * Returns whether the user is a moderator
     *
     * @returns {boolean}
     */
    this.isModerator = function () {
        return this.isRolesMatches([Roles.moderator]);
    };

    /**
     * Returns whether the roles matching
     * @param rolesArray
     * @returns {boolean}
     */
    this.isRolesMatches = function (rolesArray) {
        var me = this;

        if (me.getCurrentUser() === null) {
            return false;
        }

        if (rolesArray.filter(function (n) {
                return me.getCurrentUser().userRoles.indexOf(n) !== -1;
            }).length === 0) {
            return false;
        }

        return true;
    };

    /**
     * Check if the user has the appropriate authorization
     *
     * @param rolesArray    the needed roles
     * @returns {boolean}
     */
    this.checkACL = function (rolesArray) {
        if (!rolesArray) {
            $rootScope.goForbidden();
            return false;
        }

        if (rolesArray.length === 0) {
            return false;
        }

        var me = this;

        if (!me.getUserAuthenticated()) {
            if (rolesArray.indexOf(Roles.guest) === -1) {
               me.navigateToLogin();
            }
        }
        else if (!me.isRolesMatches(rolesArray)) {
            $rootScope.goForbidden();
            return false;
        }
    };

    /**
     * Returns whether the authenticated user is an approved profile
     */
    this.getUserApproved = function getUserApproved() {
        var me = this,
            currentUser = this.getCurrentUser();
        console.log('SessionService.getUserApprove() currentUser: ', currentUser);

        if (currentUser === null) {
            return false;
        }

        console.log('SessionService.getUserApprove() currentUser: ', currentUser);
        return currentUser.approvedProfile;
    };

    /**
     * Returns the highest role level of the authenticated user
     *
     * @returns {*}
     */
    this.getMaxRole = function () {
        if (this.isRolesMatches([Roles.administrator])) {
            return Roles.administrator;
        }

        if (this.isRolesMatches([Roles.moderator])) {
            return Roles.moderator;
        }
    };

}]);
