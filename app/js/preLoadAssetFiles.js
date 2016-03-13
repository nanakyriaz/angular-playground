(function () {
    "use strict";

    var assetList = [
        "images/icons/icon-transporter.png",
        "images/icons/icon-volunteer.png",
        "images/icons/icon-business.png",
        "images/icons/icon-charity.png",


        "images/maps/business-map-small_x2.png",
        "images/maps/business-map-small.png",
        "images/maps/charity-map-small_x2.png",
        "images/maps/charity-map-small.png",
        "images/maps/transporter-map-small_x2.png",
        "images/maps/transporter-map-small.png",
        "images/maps/volunteer-map-small_x2.png",
        "images/maps/volunteer-map-small.png",

        "images/maps/business-map-icon.png",
        "images/maps/business-selected-map-icon.png",
        "images/maps/charities-map-icon.png",
        "images/maps/charities-selected-map-icon.png",
        "images/maps/transporters-map-icon.png",
        "images/maps/transporters-selected-map-icon.png",
        "images/maps/volunteers-map-icon.png",
        "images/maps/volunteers-selected-map-icon.png"
    ];

    for (var i in assetList) {
        new Image().src = assetList[i];
    }

}());