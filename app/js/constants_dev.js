'use strict';

angular.module('planz.constants').value('ApiUrlValues', {

    imageResources: '/images',
    resourceImage: '/images',

    countries: 'testData/api/common/countries.json',

    login: 'testData/api/ui/user/login.json',
    logout: 'testData/api/ui/user/logout.json',
    register: '/api/ui/user',
    getProfile: 'testData/api/ui/user/profile.json',
    getUserSummary: 'testData/api/ui/user/summary.json',
    completeRegistration: 'testData/api/ui/user/complete.json',
    updateRegistration: 'testData/api/ui/user/profile.json',

    // profiles related calls
    ProfileListingCommunity: 'testData/api/ui/profile/all/community.json',
    ProfileListingNearby: 'testData/api/ui/profile/all/nearby.json',
    ProfileListingNearbyBox: 'testData/api/ui/profile/all/box.json',
    ProfileListing: 'testData/api/ui/profile/all/all.json',
    ProfileDonationSizeListing: 'testData/api/ui/donationsizes/all.json',
    ProfileFoodTypeListing: 'testData/api/ui/foodtypes/all.json',
    ProfileCollectionTimeListing: 'testData/api/ui/collectiontimes/all.json',
    ProfileDisplay: 'testData/api/ui/profile/show.json',
    ProfileUserDisplay: 'testData/api/ui/profile/current.json',
    AddFriendToProfile: 'testData/api/ui/profile/friend.json',


    // messaging related calls
    CreateMessage: 'testData/api/ui/messaging/message/create.json',
    ReplyMessage: 'testData/api/ui/messaging/message/reply.json',
    ConversationsListing: 'testData/api/ui/messaging/conversations/all.json',
    ConversationListing: 'testData/api/ui/messaging/conversations/show.json',
    UploadMessageAttachment: 'testData/api/ui/messaging/message/upload.json',

    // deliveries
    DeliveryItem: 'testData/api/ui/deliveries/delivery/show.json',
    DeliveryItems: 'testData/api/ui/deliveries/delivery/items/all.json',
    CreateDelivery: 'testData/api/ui/deliveries/delivery/create.json',
    CreateDeliveryItem: 'testData/api/ui/deliveries/delivery/item.json',
    UpdateDeliveryItem: 'testData/api/ui/deliveries/delivery/item.json',
    DeliveryListing: 'testData/api/ui/deliveries/all.json',
    AllAvailableOwnerDeliveryReports: 'testData/api/ui/deliveries/statistics/owner.json',
    AllAvailableRecipientDeliveryReports: 'testData/api/ui/deliveries/statistics/recipient.json',
    DeliveryReportStatistics: 'testData/api/ui/deliveries/statistics.json',
    UnitOfMeasures: 'testData/api/ui/unitofmeasures/all.json',

    NewsListing: 'testData/api/ui/news/all.json',
    NewsDisplay: 'testData/api/ui/news/show.json',

    SuccessStoryListing: 'testData/api/ui/succcess_stories/all.json',
    SuccessStoryDisplay: 'testData/api/ui/succcess_stories/show.json',

    requestPasswordReset: '/api/ui/user/reset/request/{0}',
    requestConfirmReset: '/api/ui/user/reset/confirm/{0}',
    resetPassword: '/api/ui/user/reset/complete/{0}',
    changePassword: '/api/ui/user/secure/password/{0}',

    // Share
    sharePage: '/api/ui/share/page',

    //Subscription
    subscribe: '/api/ui/newsletter/subscribe'
});


angular.module('planz.services', []).
    value('version', 'dev');
