/*global $:false, jQuery:false */

angular.module('planz.services').
    factory('MapUtils', ['$parse', function ($parse) {

        /**
         * Create an instance of the HtmlMarker-class
         *
         * @param config    marker config
         * @constructor
         */
        function HtmlMarker(config) {
            this.setValues(config);
            var cssClasses = config.classes;
            cssClasses = cssClasses ? " " + cssClasses.join(" ") : "";
            var markerElement = this.div_ = document.createElement("div");
            markerElement.className = "map-html-marker" + cssClasses;
            if (config.icon) {
                $(markerElement).css("background-image", "url(" + config.icon + ")");
                $(markerElement).css("background-repeat", "no-repeat");
            }
            if (config.title) {
                $(markerElement).attr("title", config.title);
            }
            this.iconAnchor = config.iconAnchor;
            this.LatLng = this.getPosition();
        }

        /**
         * Stores cached measurements of marker
         * @type {{}}
         */
        HtmlMarker.measurements = {};

        HtmlMarker.prototype = new google.maps.OverlayView();

        /**
         * Renders the marker for drawing or measurement
         *
         * @param measure   measure or not
         */
        HtmlMarker.prototype.renderForDraw = function (measure) {
            var b = this.getXYPosition(), a = this.div_, c = 0, e = 0, h = this.get("html").toString();
            if (measure) {
                if (c = HtmlMarker.measurements[h]) {
                    this.pixelBoundingBox = {ne: {x: b.x, y: b.y}, sw: {x: b.x + c.width, y: b.y + c.height}};
                    return;
                }
                $(a).appendTo($(".map-element")[0]);
            }
            $(a).html(h);
            $(a).addClass("html-pin");
            e = $(a).width();
            c = $(a).height();
            var j = e / 2, f = c;
            if (this.iconAnchor) {
                if (this.iconAnchor.x) {
                    j = this.iconAnchor.x;
                }
                if (this.iconAnchor.y) {
                    if (this.iconAnchor.offsetFromBottom) {
                        f += this.iconAnchor.y;
                    } else {
                        f = this.iconAnchor.y;
                    }
                }
            }
            a.style.top = b.y - f + "px";
            a.style.left = b.x - j + "px";
            a.style.display = "block";
            a.style.zIndex = this.get("zIndex").toString();
            if (measure) {
                this.pixelBoundingBox = {ne: {x: b.x, y: b.y}, sw: {x: b.x + e, y: b.y + c}};
                $(a).html("");
                HtmlMarker.measurements[h] = {height: c, width: e, xOffset: j, yOffset: f};
            }
        };

        /**
         * @inheritDoc
         */
        HtmlMarker.prototype.onAdd = function () {
            this.getPanes().overlayMouseTarget.appendChild(this.div_);
            var that = this;
            this.listeners_ = [
                google.maps.event.addListener(this, "position_changed", function () {
                    that.draw();
                }),
                google.maps.event.addListener(this, "html_changed", function () {
                    that.draw();
                }),
                google.maps.event.addDomListener(this.div_, "click", function () {
                    google.maps.event.trigger(that, "click");
                }),
                google.maps.event.addDomListener(this.div_, "mouseover", function () {
                    google.maps.event.trigger(that, "mouseover");
                }),
                google.maps.event.addDomListener(this.div_, "mouseout", function () {
                    google.maps.event.trigger(that, "mouseout");
                })
            ];
        };

        /**
         * @inheritDoc
         */
        HtmlMarker.prototype.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
            for (var i = 0, l = this.listeners_.length; i < l; ++i) {
                google.maps.event.removeListener(this.listeners_[i]);
            }
        };

        /**
         * Draws the marker on the map
         */
        HtmlMarker.prototype.draw = function () {
            this.renderForDraw(false);
        };

        /**
         * Draws the marker on the map
         */
        HtmlMarker.prototype.measure = function () {
            this.renderForDraw(true);
            return this.pixelBoundingBox;
        };

        /**
         * Returns the pixel position of the marker on the map
         *
         * @returns {*}
         */
        HtmlMarker.prototype.getXYPosition = function () {
            return this.getProjection().fromLatLngToDivPixel(this.getPosition());
        };

        /**
         * Returns the position of the marker
         * @returns {*}
         */
        HtmlMarker.prototype.getPosition = function () {
            return this.get("position");
        };

        /**
         * Sets the visibility of the marker
         * @param flag  the visibility flag
         */
        HtmlMarker.prototype.setVisible = function (flag) {
            if (flag) {
                $(this.div_).show();
            } else {
                $(this.div_).hide();
            }
        };


        /**
         * @inheritDoc
         */
        function InfoBubble(options) {
            this.extend(InfoBubble, google.maps.OverlayView);
        }

        /**
         * Extends a objects prototype by anothers.
         *
         * @param {Object} obj1 The object to be extended.
         * @param {Object} obj2 The object to extend with.
         * @return {Object} The new extended object.
         * @ignore
         */
        InfoBubble.prototype.extend = function (obj1, obj2) {
            return (function (object) {
                for (var property in object.prototype) {
                    this.prototype[property] = object.prototype[property];
                }
                return this;
            }).apply(obj1, [obj2]);
        };

        /**
         * @inheritDoc
         */
        InfoBubble.prototype.onAdd = function () {

        };


        /**
         * Assets the given value is defined
         */
        function assertDefined(value, name) {
            if (value === undefined || value === null) {
                if (name) {
                    throw name + ' was: ' + value;
                } else {
                    throw 'value was: ' + value;
                }
            }
        }

        return {
            assertDefined: assertDefined,
            HtmlMarker: HtmlMarker
        };
    }]);
