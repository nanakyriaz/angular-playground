'use strict';

angular.module('planz.constants')

    .constant('Roles', {
        user: 'USER',
        guest: 'GUEST',
        profileAdmin: 'PROFILE_ADMIN',
        approvedProfile: 'PROFILE_APPROVED',
        unapprovedProfile: 'PROFILE_UNAPPROVED',
        deliveryAdmin: 'DELIVERY_ADMIN',

        volunteer: 'VOLUNTEER',
        transporter: 'TRANSPORTER',
        business: 'BUSINESS',
        charity: 'CHARITY',
        administrator: 'ADMINISTRATOR',
        moderator: 'MODERATOR',

        allRoles: ['GUEST', 'USER', 'VOLUNTEER', 'TRANSPORTER', 'BUSINESS', 'CHARITY', 'ADMINISTRATOR', 'MODERATOR', 'PROFILE_ADMIN', 'DELIVERY_ADMIN'],
        allRegistered: ['USER', 'VOLUNTEER', 'TRANSPORTER', 'BUSINESS', 'CHARITY', 'ADMINISTRATOR', 'MODERATOR', 'DELIVERY_ADMIN', 'PROFILE_ADMIN'],
        allApproved: ['PROFILE_APPROVED'],
        delivery: ['BUSINESS', 'CHARITY', 'VOLUNTEER', 'TRANSPORTER', 'DELIVER_ADMIN'],
        deliveryCreateOrUpdate: ['BUSINESS', 'CHARITY','VOLUNTEER', 'TRANSPORTER', 'DELIVER_ADMIN'],
        deliveryReview: ['CHARITY', 'DELIVER_ADMIN']
    }
);
