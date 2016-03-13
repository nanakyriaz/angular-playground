'use strict';

angular.module('planz.routes', ['planz.constants'])

    /**
     * Configuring the routes of the application
     */
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'Roles', function ($stateProvider, $urlRouterProvider, $locationProvider, Roles) {

        // Enable shiny html5 mode for modern browsers (for Googlebot)
        $locationProvider.hashPrefix('!');
        $urlRouterProvider.when('', '/');

        var routes = {
            '/redirect/:token': {
                name: 'redirect',
                templateUrl: 'js/views/redirect.html',
                controller: 'RedirectController',
                roles: [Roles.guest],
                resolve: {
                    userProfile: function(SessionService, LoginService, $stateParams) {
                        var sessionAuthToken = $stateParams.token;
                        SessionService.setAuthToken(sessionAuthToken);
                        SessionService.setUserAuthenticated(true);

                        return LoginService.getProfile().then(function(profileData) {
                            SessionService.setCurrentUser(profileData);
                            return profileData;
                        });
                    }
                }
            },
            '/my_profile': {
                name: 'my_profile',
                templateUrl: 'js/views/my/profile/index.html',
                controller: 'MyProfileController',
                title: 'My profile',
                roles: Roles.allRegistered,
                navigationClass: 'my_profile'
            },
            '/my_profile/modify': {
                name: 'my_profile_modify',
                templateUrl: 'js/views/my/profile/update.html',
                title: 'Manage my profile',
                controller: 'ManageMyProfileController',
                roles: Roles.allRegistered,
                navigationClass: 'my_profile',
                resolve: {
                    userProfile: function (ProfileService) {
                        return ProfileService.getUserProfile();
                    }
                }
            },
            '/my_settings': {
                name: 'my_settings',
                templateUrl: 'js/views/my/settings/index.html',
                controller: 'MySettingsController',
                title: 'My Settings',
                roles: Roles.allRegistered,
                navigationClass: 'my_settings',

                resolve: {

                    previousState: function($state) {
                        var currentStateData = {
                            name: $state.current.name,
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };

                        return currentStateData;
                    }

                }
            },
            '/my_community/:type?': {
                name: 'my_community',
                templateUrl: 'js/views/my/community/index.html',
                controller: 'MyCommunityController',
                title: 'My Community',
                roles: Roles.allRoles,
                navigationClass: 'my_community',
                reloadOnSearch: false,
                resolve: {

                    /**
                     * Returns the profile friends of the authenticated user
                     *
                     * @param ProfileService
                     * @returns {*}
                     */
                    communityFriends: function(ProfileService) {
                        return ProfileService.getCommunityProfiles();
                    }
                }
            },

            '/my_messages': {
                name: 'my_messages',
                templateUrl: 'js/views/my/messaging/index.html',
                controller: 'MessagingController',
                title: 'Message Centre',
                roles: Roles.allRegistered,
                navigationClass: 'my_messages'
            },
            '/my_messages/:message_id': {
                name: 'my_messages_detail',
                templateUrl: 'js/views/my/messaging/index.html',
                controller: 'MessagingController',
                title: 'Message Centre',
                roles: Roles.allRegistered,
                navigationClass: 'my_messages'
            },
            '/create_message': {
                name: 'create_message',
                templateUrl: 'js/views/my/messaging/create.html',
                controller: 'MessageController',
                roles: Roles.allRegistered,
                title: 'Create message',
                navigationClass: 'my_messages'
            },

            '/my_deliveries/:mode?': {
                name: 'my_donations',
                templateUrl: 'js/views/my/deliveries/deliveries.html',
                controller: 'MyDeliveriesController',
                roles: Roles.delivery,
                approvedUserOnly: true,
                title: 'My food donations',
                navigationClass: 'my_deliveries',
                resolve: {

                    /**
                     * Returns the current profile data of the authenticated user
                     *
                     * @param SessionService
                     * @returns {*}
                     */
                    currentProfile: function (SessionService) {
                        return SessionService.getCurrentUser();
                    },

                    notificationMarked: function(NotificationService) {
                        return NotificationService.markAllNotifications('notification')
                            .catch(function(err) {
                                console.warn('Error occurred while marking the notifications as read.');
                            })
                            .then(function() {
                                console.log('Marked all notifications :)');
                            });
                    },

                    /**
                     * Retrieves all the available reports for the authenticated user
                     *
                     * @param DeliveryService
                     * @returns {*}
                     */
                    availableReports: function (SessionService, DeliveryService) {
                        var currentUser = SessionService.getCurrentUser();
                        if (currentUser.profileType === 'business') {
                            return DeliveryService.getAllAvailableReportsForOwner();
                        } else if (currentUser.profileType === 'charity') {
                            return DeliveryService.getAllAvailableReportsForRecipient();
                        } else {
                            return DeliveryService.getAllAvailableReportsForCollaborators();
                        }
                    }
                }
            },
            '/my_deliveries/:id/modify': {
                name: 'my_donation_modify',
                templateUrl: 'js/views/my/deliveries/update.html',
                controller: 'ModifyDeliveryController',
                roles: Roles.deliveryCreateOrUpdate,
                approvedUserOnly: true,
                navigationClass: 'update_delivery',
                title: 'Modify food donation',
                resolve: {

                    /**
                     * Retrieves the delivery with the given identifier
                     *
                     * @param DeliveryService
                     * @param $stateParams
                     * @returns {*}
                     */
                    delivery: function (DeliveryService, $stateParams) {
                        var deliveryId = $stateParams.id;
                        return DeliveryService.getDeliveryById(deliveryId, true);
                    },

                    /**
                     * Retrieves the profile types before navigating to this route
                     *
                     * @param ProfileService
                     * @returns {*}
                     */
                    unitOfMeasures: function(DeliveryService) {
                        return DeliveryService.getUnitOfMeasures();
                    },
                    volunteerProfiles: function (ProfileService) {
                        return ProfileService.getProfiles({profileType: 'volunteer'});
                    },

                    transporterProfiles: function (ProfileService) {
                        return ProfileService.getProfiles({profileType: 'transporter'});
                    }
                }
            },
            '/my_deliveries/:id/review': {
                name: 'my_donation_review',
                templateUrl: 'js/views/my/deliveries/review.html',
                controller: 'ReviewDeliveryController',
                roles: Roles.deliveryReview,
                approvedUserOnly: true,
                title: 'Review food donation',
                navigationClass: 'review_delivery',
                resolve: {

                    /**
                     * Retreives the delivery with the given identifier
                     *
                     * @param DeliveryService
                     * @param $stateParams
                     * @returns {*}
                     */
                    delivery: function (DeliveryService, $stateParams) {
                        var deliveryId = $stateParams.id;
                        return DeliveryService.getDeliveryById(deliveryId);
                    }
                }
            },
            '/food_donations/:id/accept': {
                name: 'my_donation_accept',
                templateUrl: 'js/views/my/deliveries/accept.html',
                controller: 'AcceptDeliveryController',
                title: 'Accept delivery',
                roles: Roles.delivery,
                approvedUserOnly: true,
                navigationClass: 'update_delivery',
                resolve: {

                    /**
                     * Retrieve the delivery with the given identifier
                     *
                     * @param DeliveryService
                     * @param $stateParams
                     * @returns {*}
                     */
                    delivery: function (DeliveryService, $stateParams) {
                        var deliveryId = $stateParams.id;
                        return DeliveryService.getDeliveryById(deliveryId, false);
                    }
                }
            },
            '/food_donations/:id/request': {
                name: 'my_donation_request',
                templateUrl: 'js/views/my/deliveries/request.html',
                controller: 'RequestDeliveryController',
                roles: Roles.delivery,
                approvedUserOnly: true,
                title: 'Request delivery',
                navigationClass: 'update_delivery',
                resolve: {

                    /**
                     * Retrieve the delivery with the given identifier
                     *
                     * @param DeliveryService
                     * @param $stateParams
                     * @returns {*}
                     */
                    donation: function (DeliveryService, $stateParams) {
                        var donationId = $stateParams.id;
                        return DeliveryService.getDeliveryById(donationId, false);
                    },

                    deliveryRequest: function(DeliveryService, $stateParams) {
                        var donationId = $stateParams.id;
                        return DeliveryService.getDeliveryRequestByDonation(donationId, false);
                    },

                    /**
                     * Accept the delivery request when visiting the page
                     *
                     * @param DeliveryService
                     * @returns {*}
                     */
                    isAcceptedDelivery: function(DeliveryService, $stateParams) {
                        var donationId = $stateParams.id;
                        return DeliveryService.acceptDeliveryRequest(donationId)
                            .then(function() {
                                return true;
                            })
                            ['catch'](function() {
                            return false;
                        });
                    }
                }
            },
            '/my_deliveries/:id/display': {
                name: 'my_donation_display',
                templateUrl: 'js/views/my/deliveries/show.html',
                controller: 'DisplayDeliveryController',
                roles: Roles.delivery,
                approvedUserOnly: true,
                title: 'Food donation',
                navigationClass: 'update_delivery',
                resolve: {

                    /**
                     * Retrieve the delivery with the given identifier
                     *
                     * @param DeliveryService
                     * @param $stateParams
                     * @returns {*}
                     */
                    delivery: function (DeliveryService, $stateParams) {
                        var deliveryId = $stateParams.id;
                        return DeliveryService.getDeliveryById(deliveryId, false);
                    }
                }
            },
            '/create_delivery': {
                name: 'create_donation',
                templateUrl: 'js/views/my/deliveries/create.html',
                controller: 'CreateDeliveryController',
                roles: Roles.deliveryCreateOrUpdate,
                approvedUserOnly: true,
                navigationClass: 'create_delivery',
                title: 'Create food donation',
                resolve: {

                    /**
                     * Retrieves the profile types before navigating to this route
                     *
                     * @param ProfileService
                     * @returns {*}
                     */
                    unitOfMeasures: function(DeliveryService) {
                        return DeliveryService.getUnitOfMeasures();
                    },
                    volunteerProfiles: function (ProfileService) {
                        return ProfileService.getProfiles({profileType: 'volunteer'});
                    },

                    transporterProfiles: function (ProfileService) {
                        return ProfileService.getProfiles({profileType: 'transporter'});
                    }
                }
            },
            '/map': {
                name: 'map',
                templateUrl: 'js/views/map/index.html',
                controller: 'MapController',
                roles: Roles.allRoles,
                title: 'Map',
                navigationClass: 'map'
            },

            '/login': {
                name: 'login',
                templateUrl: 'js/views/login/index.html',
                controller: 'LoginController',
                title: 'Login',
                roles: [Roles.guest]
            },
            //'/login/:scenario/:email': {
            //    templateUrl: 'js/views/login/index.html',
            //    controller: 'LoginController',
            //    title: 'Login',
            //    roles: [Roles.guest]
            //},
            '/forgotten': {
                name: 'forgotten',
                templateUrl: 'js/views/login/forgotten_details.html',
                controller: 'ForgottenController',
                title: 'Forgotten password',
                roles: [Roles.guest]
            },
            '/forgotten/confirmation': {
                name: 'forgotten_confirmation',
                templateUrl: 'js/views/login/forgotten_confirmation.html',
                controller: 'ForgottenController',
                title: 'Forgotten password',
                roles: [Roles.guest]

            },
            '/email_confirm': {
                name: 'email_confirm',
                templateUrl: 'js/views/login/confirm_details.html',
                controller: 'ConfirmationController',
                title: 'Confirm Email',
                roles: [Roles.guest]
            },
            '/email_confirm/confirmation': {
                name: 'email_confirm_confirmation',
                templateUrl: 'js/views/login/confirm_confirmation.html',
                controller: 'ConfirmationController',
                title: 'Confirm Email',
                roles: [Roles.guest]

            },
            '/user/reset-password/:email/:token': {
                name: 'reset_password',
                templateUrl: 'js/views/login/reset_password.html',
                controller: 'ResetPasswordController',
                title: 'Reset password',
                roles: [Roles.guest]
            },
            '/forgotten/complete': {
                name: 'forgotten_complete',
                templateUrl: 'js/views/login/reset_password_confirmation.html',
                controller: 'ResetPasswordController',
                title: 'Reset password',
                roles: [Roles.guest]
            },
            '/registration/complete/:email/:token': {
                name: 'registration_complete',
                templateUrl: 'js/views/signup/confirmation.html',
                controller: 'RegistrationConfirmationController',
                roles: Roles.allRoles,

                resolve: {
                    status: function confirmAccount($stateParams, RegistrationService) {
                        var emailAddress = $stateParams.email;
                        var confirmationToken = $stateParams.token;
                        return RegistrationService.confirmRegistration(emailAddress, confirmationToken)
                            .then(function(profileData) {
                                return profileData;
                            }, function (error) {
                                // Error occurred while confirming account
                                console.log('Error occurred while confirming account: ', error);
                                return error;
                            });
                    }
                }
            },
            '/registration/thanks': {
                name: 'registration_thanks',
                templateUrl: 'js/views/signup/thanks.html',
                controller: 'RegistrationThanksController',
                roles: Roles.allRoles
            },
            '/registration/:group?': {
                name: 'registration',
                templateUrl: 'js/views/signup/registration.html',
                controller: 'RegistrationController',
                roles: Roles.allRoles
            },
            '/newregistration': {
                name: 'newregistration',
                abstract: true,
                templateUrl: 'js/views/new_registration/new_registration.html',
                controller: 'NewRegistrationController',
                roles: Roles.allRoles
            },
            '/new?skipValidation': {
              name: 'newregistration.newaccount',
              templateUrl: 'js/views/new_registration/newaccount.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 1
              }
            },
            '/address?skipValidation': {
              name: 'newregistration.address',
              templateUrl: 'js/views/new_registration/address.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 2
              }
            },
            '/details?skipValidation': {
              name: 'newregistration.addressDetails',
              templateUrl: 'js/views/new_registration/addressDetails.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 2
              }
            },
            '/donation?skipValidation': {
              name: 'newregistration.donation',
              templateUrl: 'js/views/new_registration/donation.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 3
              }
            },
            '/finish?skipValidation': {
              name: 'newregistration.finish',
              templateUrl: 'js/views/new_registration/finish.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 4
              }
            },
            '/done?skipValidation': {
              name: 'newregistration.done',
              templateUrl: 'js/views/new_registration/done.html',
              roles: Roles.allRoles,
              title: 'Registration',
              data: {
                step: 4,
                done: true
              }
            },
            '/newprofile': {
                name: 'newprofile',
                templateUrl: 'js/views/new_registration/new_profile_view.html',
                controller: 'NewProfileViewController',
                roles: Roles.allRoles
                /*resolve: {
                    userProfile: function (ProfileService) {
                        return ProfileService.getUserProfile();
                    }
                }*/
            },
            '/newprofile_modify': {
                name: 'newprofile_modify',
                templateUrl: 'js/views/new_registration/new_profile_update.html',
                controller: 'NewProfileUpdateController',
                roles: Roles.allRoles
                /*resolve: {
                    userProfile: function (ProfileService) {
                        return ProfileService.getUserProfile();
                    }
                }*/
            },
            '/profiles/:id?': {
                name: 'profile_detail',
                templateUrl: 'js/views/profiles/show.html',
                controller: 'ProfileController',
                roles: Roles.allRoles,
                navigationClass: 'profile',
                resolve: {
                    currentProfile: function retrieveProfile($stateParams, ProfileService) {
                        var profileId = $stateParams.id;
                        return ProfileService.getProfileById(profileId)
                            .then(null, function (errorData) {
                                console.log('Error occurred. errorData: ', errorData);
                            });
                    }
                }
            },
            '/success_story/videos/:id': {
                name: 'success_stories_video_detail',
                templateUrl: 'js/views/success_story/show.html',
                controller: 'SuccessStoryController',
                navigationClass: 'success_stories',
                roles: Roles.allRoles
            },
            '/success_story/:id': {
                name: 'success_stories_detail',
                templateUrl: 'js/views/success_story/show.html',
                controller: 'SuccessStoryController',
                navigationClass: 'success_stories',
                roles: Roles.allRoles,
                resolve: {
                    recordItem: function retrieveStoryItem($stateParams, SuccessStoryService) {
                        var newsId = $stateParams.id;
                        return SuccessStoryService.getSuccessStoryById(newsId)
                            .then(null, function (errorData) {
                                console.log('Error occurred. errorData: ', errorData);
                            });
                    }
                }
            },
            '/success_stories': {
                name: 'success_stories',
                templateUrl: 'js/views/success_story/list.html',
                controller: 'SuccessStoryOverviewController',
                navigationClass: 'success_stories',
                title: 'Zheroes Stories',
                roles: Roles.allRoles,
                resolve: {

                    /**
                     * Returns a list of success stories items
                     *
                     * @param SuccessStoryService
                     * @returns {*}
                     */
                    recordItems: function (SuccessStoryService) {
                        return SuccessStoryService.getSuccessStoryList(999);
                    }
                }
            },
            '/news/:id': {
                name: 'news_detail',
                templateUrl: 'js/views/news/show.html',
                controller: 'NewsDisplayController',
                navigationClass: 'news',
                roles: Roles.allRoles,
                resolve: {
                    recordItem: function retrieveNewsItem($stateParams, NewsService) {
                        var newsId = $stateParams.id;
                        return NewsService.getNewsById(newsId)
                            .then(null, function (errorData) {
                                console.log('Error occurred. errorData: ', errorData);
                            });
                    }
                }
            },
            '/news': {
                name: 'news',
                templateUrl: 'js/views/news/list.html',
                controller: 'NewsOverviewController',
                navigationClass: 'news',
                title: 'News',
                roles: Roles.allRoles,
                resolve: {

                    /**
                     * Returns a list of news items
                     *
                     * @param NewsService
                     * @returns {*}
                     */
                    recordItems: function retrieveNewsItems(NewsService) {
                        return NewsService.getNewsList(999);
                    }
                }
            },
            '/contact': {
                name: 'contact',
                templateUrl: 'js/views/landing/anonymous/contact.html',
                roles: Roles.allRoles,
                navigationClass: 'contact',
                title: 'Contact Us'
            },
            '/donate': {
                name: 'donate',
                templateUrl: 'js/views/landing/anonymous/donate.html',
                navigationClass: 'donate',
                title: 'Donate',
                roles: Roles.allRoles
            },
            '/howwework': {
                name: 'howwework',
                templateUrl: 'js/views/landing/anonymous/howwework.html',
                navigationClass: 'howwework',
                roles: Roles.allRoles,
                title: 'How We Work'
            },
            '/howyoucanhelp/:target?': {
                name: 'howyoucanhelp',
                templateUrl: 'js/views/landing/anonymous/howyoucanhelp.html',
                controller: 'PageController',
                navigationClass: 'howyoucanhelp',
                roles: Roles.allRoles,
                title: 'How You Can Help',
                reloadOnSearch: false
            },
            '/sponsors': {
                name: 'sponsors',
                templateUrl: 'js/views/landing/anonymous/sponsors.html',
                navigationClass: 'sponsors',
                title: 'Sponsors & friends',
                roles: Roles.allRoles
            },
            '/friends': {
                name: 'friends',
                templateUrl: 'js/views/landing/anonymous/friends.html',
                navigationClass: 'friends',
                title: 'Friends',
                roles: Roles.allRoles
            },
            '/faqs': {
                name: 'faqs',
                templateUrl: 'js/views/landing/anonymous/faqs.html',
                navigationClass: 'faqs',
                roles: Roles.allRoles,
                title: 'FAQs'
            },
            '/about': {
                name: 'about',
                templateUrl: 'js/views/landing/anonymous/about.html',
                navigationClass: 'about',
                roles: Roles.allRoles,
                title: 'About us'
            },
            '/ourstory': {
                name: 'ourstory',
                templateUrl: 'js/views/landing/anonymous/ourstory.html',
                navigationClass: 'ourstory',
                roles: Roles.allRoles,
                title: 'Our story'
            },
            '/ourteam': {
                name: 'ourteam',
                templateUrl: 'js/views/landing/anonymous/ourteam.html',
                navigationClass: 'ourteam',
                roles: Roles.allRoles,
                title: 'Our team'
            },
            '/cookie_policy': {
                name: 'cookie_policy',
                templateUrl: 'js/views/landing/anonymous/cookies.html',
                navigationClass: 'cookies',
                title: 'Cookie policy',
                roles: Roles.allRoles
            },
            '/terms_and_conditions': {
                name: 'terms_and_conditions',
                templateUrl: 'js/views/landing/anonymous/terms.html',
                navigationClass: 'terms',
                roles: Roles.allRoles
            },
            '/help': {
                name: 'help',
                templateUrl: 'js/views/landing/anonymous/help.html',
                navigationClass: 'help',
                title: 'Help',
                roles: Roles.allRoles
            },
            '/subscribe': {
                name: 'subscribe',
                templateUrl: 'js/views/landing/anonymous/subscribe.html',
                controller: 'SubscribeController',
                navigationClass: 'subscribe',
                roles: Roles.allRoles
            },
            '/admin': {
                name: 'admin',
                templateUrl: 'js/views/administration/index.html',
                navigationClass: 'admin',
                title: 'Administration',
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    }
                }
            },
            '/admin/profiles': {
                name: 'admin_profiles',
                templateUrl: 'js/views/administration/profiles/list.html',
                controller: 'AdminProfileOverviewController',
                navigationClass: 'admin_profiles',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    unapprovedItems: function getNotApprovedProfiles(ProfileService) {
                        return ProfileService.getUnapprovedProfiles()
                            .then(null, function (error) {
                            });
                    },
                    approvedItems: function getApprovedProfiles(ProfileService) {
                        return ProfileService.getApprovedProfiles()
                            .then(null, function (error) {
                            });
                    }
                }
            },
            '/admin/subscribers': {
                name: 'admin_subscribers',
                templateUrl: 'js/views/administration/subscribers/list.html',
                controller: 'AdminSubscribersOverviewController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    recordItems: function getContentItems(SubscriptionService) {
                        return SubscriptionService.getNewsletterSubscribers(999);
                    }
                }
            },
            '/admin/success_story': {
                name: 'admin_success_story',
                templateUrl: 'js/views/administration/success_stories/list.html',
                controller: 'AdminSuccessStoryOverviewController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    recordItems: function getContentItems(SuccessStoryService) {
                        return SuccessStoryService.getSuccessStoryList(999);
                    }
                }
            },
            '/admin/success_story/create': {
                name: 'admin_success_story_create',
                templateUrl: 'js/views/administration/success_stories/modify.html',
                controller: 'AdminSuccessStoryContentController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    contentItem: function() {
                        return null;
                    }
                }
            },
            '/admin/success_story/:id': {
                name: 'admin_success_story_detail',
                templateUrl: 'js/views/administration/success_stories/modify.html',
                controller: 'AdminSuccessStoryContentController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    contentItem: function getContentById(SuccessStoryService, $stateParams) {
                        var contentId = $stateParams.id;
                        return SuccessStoryService.getSuccessStoryById(contentId);
                    }
                }
            },
            '/admin/news': {
                name: 'admin_news',
                templateUrl: 'js/views/administration/news/list.html',
                controller: 'AdminNewsOverviewController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    recordItems: function getContentItems(NewsService) {
                        return NewsService.getNewsList(999);
                    }
                }
            },
            '/admin/news/create': {
                name: 'admin_news_create',
                templateUrl: 'js/views/administration/news/modify.html',
                controller: 'AdminNewsContentController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    contentItem: function() {
                        return null;
                    }
                }
            },
            '/admin/news/:id': {
                name: 'admin_news_detail',
                templateUrl: 'js/views/administration/news/modify.html',
                controller: 'AdminNewsContentController',
                roles: [Roles.administrator],
                resolve: {
                    adminMessages: function(ProfileService) {
                        return ProfileService.getProfileAlerts();
                    },

                    contentItem: function getContentById(NewsService, $stateParams) {
                        var contentId = $stateParams.id;
                        return NewsService.getNewsById(contentId);
                    }
                }
            },
            '/admin/donations': {
                name: 'admin_donations',
                templateUrl: 'js/views/administration/donations/list.html',
                controller: 'AdminDonationsOverviewController',
                roles: [Roles.administrator],
                resolve: {
                    contentItem: function() {
                        return null;
                    }
                }
            },
            '/': {
                name: 'home',
                templateUrl: 'js/views/landing/anonymous/index.html',
                controller: 'AnonymousController',
                roles: Roles.allRoles
            },
            '/403': {
                name: 'forbidden',
                templateUrl: 'js/views/403.html',
                roles: Roles.allRoles
            },
            '/404': {
                name: 'not_found',
                templateUrl: 'js/views/404.html',
                roles: Roles.allRoles
            },
            '/500': {
                name: 'server_error',
                templateUrl: 'js/views/500.html',
                roles: Roles.allRoles
            }
        };

        console.log('Routes: ', routes);
        for (var path in routes) {
            var currentRoute = routes[path];
            currentRoute.url = path;
            $stateProvider.state(currentRoute.name, currentRoute);
        }
    }]);
