'use strict';

angular.module('planz.constants').value('ApiUrlValues', {

    imageResources: '/images',
    resourceImage: '/images',

    countries: 'v1/common/countries',

    login: '/login',
    logout: '/logout',
    register: '/v1/register/',
    getProfile: '/v1/profile/current',
    getUserSummary: '/v1/profile/current',
    completeRegistration: '/v1/user/confirm/{0}/{1}',
    updateRegistration: '/v1/profile/current',

    ProfileAlerts: '/v1/profile/current/alerts',
    ProfileListingCommunity: '/v1/profile/current/friends',
    ProfileListingNearby: '/v1/profiles/nearby',
    ProfileListingNearbyBox: '/v1/profiles/region',
    ProfileListingFriends: '/v1/profile/current/friends',
    ProfileListing: '/v1/profiles',
    ProfileSearchByName: '/v1/profiles/search',
    adminUnapprovedProfilesListing: '/v1/profiles/unapproved',
    adminExportUnapprovedProfiles: '/v1/profiles/export/unapproved',
    adminApprovedProfilesListing: '/v1/profiles/approved',
    adminExportApprovedProfiles: '/v1/profiles/export/approved',
    adminProfileApprove: '/v1/profile/{0}/approve',
    adminProfileUnapprove: '/v1/profile/{0}/unapprove',
    adminProfileDeactivate: '/v1/profile/{0}/deactivate',
    ProfileDonationSizeListing: '/v1/donationsizes',
    ProfileFoodTypeListing: '/v1/foodtypes',
    ProfileCollectionTimeListing: '/v1/collectiontimes',
    ProfileDisplay: '/v1/profile/{0}',
    ProfileUserDisplay: '/v1/profile/current',
    AddFriendToProfile: '/v1/profile/current/friends/{0}',
    UserSettings: '/v1/profile/current/settings',
    UpdateProfile: '/v1/profile/current',
    UploadProfilePhoto: '/v1/profile/current/photo',
    UpdateProfilePhoto: '/v1/profile/current/photo',

    CreateMessage: '/v1/message/create',
    ReplyMessage: '/v1/message/{0}',
    ConversationsListing: '/v1/messages',
    ConversationListing: '/v1/messages/{0}',
    UploadMessageAttachment: '/v1/messages/{0}/attachment',

    UnreadNotifications: '/v1/profile/current/notifications',
    MarkUnreadNotifications: '/v1/notifications/all',
    NotificationsStatus: '/v1/profile/current/notifications/status',
    NumberOfUnreadNotifications: '/v1/profile/current/notifications/count',
    MarkDonationNotifications: '/v1/notifications/donations/all',

    CreateFeedback: '/v1/feedback',

    DeliveryItem: '/v1/donations/{0}',
    DeliveryItems: '/v1/donations/{0}/items',
    CreateDelivery: '/v1/donations',
    CreateDeliveryItem: '/v1/donations/{0}/items',
    ReviewDelivery: '/v1/donations/{0}/review',
    UpdateDelivery: '/v1/donations/{0}/modify',
    AcceptDelivery: '/v1/donations/{0}/accept',
    DeliveryRequests: '/v1/donations/{0}/requests',

    UpdateDeliveryItem: '/v1/donations/{0}/items/{1}',
    CreateDeliveryRequest: '/v1/donation/{0}/delivery/request',
    AcceptDeliveryRequest: '/v1/donation/{0}/delivery/accept',
    CollectedDelivery: '/v1/donation/{0}/delivery/collected',
    CompleteDelivery: '/v1/donation/{0}/delivery/completed',
    FailedDelivery: '/v1/donation/{0}/delivery/failed',
    DeleteDelivery: '/v1/donations/{0}',
    DeliveryListing: '/v1/donations/',
    AllAvailableOwnerDeliveryReports: '/v1/donations/owner/statistics',
    AllAvailableRecipientDeliveryReports: '/v1/donations/recipient/statistics',
    AllAvailableCollaboratorsDeliveryReports: '/v1/donations/collaborators/statistics',
    DeliveryReportStatistics: '/v1/donations/statistics',
    ExportDeliveryReportStatistics: '/v1/donations/statistics/export',
    UnitOfMeasures: '/v1/unitofmeasures',


    NewsListing: '/v1/news',
    NewsDisplay: '/v1/news/{0}',

    SuccessStoryFrontListing: '/v1/front',
    SuccessStoryListing: '/v1/successstories',
    SuccessStoryDisplay: '/v1/successstories/{0}',

    requestPasswordReset: '/v1/user/reset/request/{0}',
    requestConfirmReset: '/v1/user/reset/confirm/{0}',
    resetPassword: '/v1/user/reset/complete/{0}',
    changePassword: '/v1/profile/current/password',

    // Share
    sharePage: '/v1/share/page',

    //Subscription
    subscribe: '/v1/newsletter/subscribe',
    NewsletterListing: '/v1/newsletter/subscribers',
    ExportNewsletterSubcribers: '/v1/newsletter/subscribers/export'
});
