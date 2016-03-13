'use strict';

angular.module('planz.directives')
  .directive('pzProfilePickers', ['$timeout', '$document', '$sce', function ($timeout, $document, $sce) {

    function SuggestionList(loadFn, favourites) {
      var self = {},
          deboundedLoadId,
          getDifferences,
          lastPromise;

      // store the favourites associated with the profile picker
      self.favourites = favourites || [];

      /**
       * Resets the state of the suggestion list
       */
      self.reset = function() {
        lastPromise = null;
        self.items = [];
        self.visible = false;
        self.index = -1;
        self.selected = null;
        self.query = null;
        $timeout.cancel(deboundedLoadId);
      };

      /**
       *
       * @param query
       */
      self.load = function(query) {
        $timeout.cancel(deboundedLoadId);

        deboundedLoadId = $timeout(function() {
          self.query = query;

          var promise = loadFn({ $query: query });
          lastPromise = promise;

          promise.then(function(items) {
            if (promise !== lastPromise) {
              return;
            }

            // add the favourites to the top of the list and mark them specially
            self.items = self.favourites.concat(items);

            //
            //self.items = items.slice(0, 100); // limit the display to 100 items
            if (self.items.length > 0) {
              self.show();
            } else {
              self.reset();
            }
          });
        }, 100, true);
      };

      /**
       * Returns the number of associated favourite items
       *
       * @returns {Number}
       */
      self.getTotalFavourites = function() {
        return self.favourites.length;
      };

      /**
       * Select the next item within the list
       */
      self.selectNext = function() {
        self.select(++self.index);
      };

      /**
       * Select previous item within the list
       */
      self.selectPrior = function() {
        self.select(--self.index);
      };

      /**
       * Select the item at the given index
       *
       * @param index the position of the item
       */
      self.select = function(index) {
        if (index < 0) {
          index = self.items.length - 1;
        }
        else if (index >= self.items.length) {
          index = 0;
        }
        self.index = index;
        self.selected = self.items[index];
      };


      /**
       * Display the suggestion list on the screen
       */
      self.show = function() {
          self.selected = null;
          self.visible = true;
      };

      /**
       * Returns the index of the selected item;
       * @returns {number|*}
       */
      self.getItemIndex = function() {
          return self.index;
      };

      // initialise the list
      self.reset();
      return self;
    }

    return {
      restrict: 'EA',
      require: '^pzProfilePicker',
      scope: {
        source: '&',
        favourites: '='
      },
      templateUrl: 'js/directives/pz_profile_picker_autocomplete.html',

      link: function(scope, element, attrs, profilePickerCtrl) {
        var hotkeys = [13, 9, 27, 38, 40],
            dropdownList = $(element).find('ul.suggestion-list'),
            dropdownContainer = dropdownList.parent(),
            dropdownHeight = dropdownContainer.outerHeight(),
            profilePicker,
            suggestionList,
            shouldLoadSuggestions,
            ensureItemIsVisible,
            getDisplayText,
            isKeyNavigating = false;

        // notify the profile picker that the autocomplete-element is available
        profilePicker = profilePickerCtrl.registerAutocomplete();

        //
        suggestionList = new SuggestionList(scope.source, scope.favourites);
        scope.suggestionList = suggestionList;

        // check if we should display the suggestions menu
        shouldLoadSuggestions = function(value) {
          return value && value.length >= 3 || !value;
        };

        // make sure the dropdown item is visible
        ensureItemIsVisible = function() {
          var itemIndex = suggestionList.getItemIndex();
          var itemElement = dropdownList.children('li')[itemIndex];

          if (itemElement) {
            // get the top left position of the item and check whether it's in view
            itemElement = $(itemElement);
            var containerOffset = $(dropdownContainer).scrollTop(),
                itemTopOffset = itemElement.position().top,
                itemBottomOffset = itemTopOffset + itemElement.outerHeight(true);

            if (itemTopOffset < 0) {
              $(dropdownContainer).scrollTop(containerOffset + itemTopOffset);
            } else if (dropdownHeight < itemBottomOffset) {
              $(dropdownContainer).scrollTop(containerOffset + (itemBottomOffset - dropdownHeight));
            }

          }
        };

        // return the text to display as dropdown item label
        getDisplayText = function(item) {
          return item.fullName;
        };

        // listen to incoming events from the profile picker element
        profilePicker
//          .on('profile-added profile-removed invalid-profile input-blur', function() {
          .on('profile-removed invalid-profile input-blur', function() {
            suggestionList.reset();
          })
          .on('profile-added', function() {
              var value = profilePicker.getCurrentProfileText();
          })
          .on('input-change', function(value) {
            if (shouldLoadSuggestions(value)) {
              suggestionList.load(value, profilePicker.getProfiles());
            } else {
              suggestionList.reset();
            }
          })
          .on('input-focus', function(e) {
            var value = profilePicker.getCurrentProfileText();
            if (true && shouldLoadSuggestions(value)) {
              suggestionList.load(value, profilePicker.getProfiles());
            }
          })
          .on('input-keydown', function(e) {
            var key = e.keyCode,
                handleEvent = false;

            //
            if (hotkeys.indexOf(key) === -1) {
              return;
            }

            //
            if (suggestionList.visible) {
              if (key === 40) {
                suggestionList.selectNext();
                handleEvent = true;
              }
              else if (key === 38) {
                suggestionList.selectPrior();
                handleEvent = true;
              }
              else if (key === 27) {
                suggestionList.reset();
                handleEvent = true;
              }
              else if (key === 13|| key === 9) {
                handleEvent = scope.addSuggestion();
              }

              ensureItemIsVisible();
            }
            else {
              if (key === 40 && true) {
                suggestionList.load(profilePicker.getCurrentProfileText(), profilePicker.getProfiles());
                handleEvent = true;
              }
            }

            if (handleEvent) {
              isKeyNavigating = true;

              e.preventDefault();
              e.stopImmediatePropagation();
              scope.$apply();
            }
          });

        //
        function replaceAll(str, substr, newSubstr) {
          if (!substr) {
            return str;
          }

          var expression = substr.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
          return str.replace(new RegExp(expression, 'gi'), newSubstr);
        }

        function encodeHTML(value) {
          return value.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }

        scope.highlight = function(item) {
            var text = getDisplayText(item);
            if (null === text) {
              return '(Empty)';
            }

            text = encodeHTML(text);
            if (true) {
              text = replaceAll(text, encodeHTML(suggestionList.query), '<em>$&</em>');
            }
            return $sce.trustAsHtml(text);
        };

        scope.getItemImage = function(item) {
          if (item.hasOwnProperty("avatarImages")) {
            return item.avatarImages.thumb;
          }

          return '/images/icons/icon-' + item.type + '-sm.png';
        };

        //
        scope.selectItemByIndex = function(itemIndex) {
          if (false === isKeyNavigating) {
            suggestionList.select(itemIndex);
          }
        };

        scope.resetState = function() {
          isKeyNavigating = false;
        };

        //
        scope.addSuggestionByIndex = function(index) {
            suggestionList.select(index);
            scope.addSuggestion();
        };

        //
        scope.displaySuggestions = function() {
          suggestionList.load('', profilePicker.getProfiles());
        };

        scope.addSuggestion = function() {
          var added = false;
          if (suggestionList.selected) {
            profilePicker.addProfile(suggestionList.selected);
            suggestionList.reset();
            profilePicker.focusInput();

            //
            this.displaySuggestions();

            isKeyNavigating = false;
            added = true;
          }

          return added;
        };
      }
    };
  }]);
