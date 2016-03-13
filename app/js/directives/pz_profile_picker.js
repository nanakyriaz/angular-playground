'use strict';

/**
 * Simplified implementation of an event manager
 *
 * @returns {{on: Function, trigger: Function}}
 * @constructor
 */
function EventEmitter() {
  var events = {};
  return {
    on: function(names, handler) {
      names.split(' ').forEach(function(name) {
        if (!events[name]) {
          events[name] = [];
        }
        events[name].push(handler);
      });
      return this;
    },
    trigger: function(name, args) {
      angular.forEach(events[name], function(handler) {
        handler.call(null, args);
      });
      return this;
    }
  };
}


//
function makeObjectArray(array, key) {
  array = array || [];
  if (array.length > 0 && !angular.isObject(array[0])) {
    array.forEach(function(item, index) {
      array[index] = {};
      array[index][key] = item;
    });
  }
  return array;
}

//
function findInObjectArray(array, obj, key) {
  var item = null;
  for (var i = 0; i < array.length; i++) {
    // I'm aware of the internationalization issues regarding toLowerCase()
    // but I couldn't come up with a better solution right now
    console.log(array[i], obj[key]);
    if (array[i][key].toLowerCase() === obj[key].toLowerCase()) {
      item = array[i];
      break;
    }
  }
  return item;
}

angular.module('planz.directives')
  .directive('tiTranscludeAppend', function() {
    return function(scope, element, attrs, ctrl, transcludeFn) {
      transcludeFn(function(clone) {
        element.append(clone);
      });
    };
  })
  .directive('pzProfilePicker', ['$timeout', '$document', function ($timeout, $document) {
    function ProfileList(options, events) {
      var self = {}, getProfileText, setProfileText, profileIsValid;

      getProfileText = function(profile) {
        return profile['fullName'];
      };

      setProfileText = function(profile, text) {
        profile['fullName'] = text;
      };

      profileIsValid = function(profile) {
        var profileText = getProfileText(profile);

        return profileText &&
          profileText.length >= 0;
      };

      self.items = [];

      self.addText = function(text) {
        var profile = {};
        setProfileText(profile, text);
        return self.add(profile);
      };

      self.add = function(profile) {
        var profileText = getProfileText(profile);
        setProfileText(profile, profileText);

        if (profileIsValid(profile)) {
          self.items.push(profile);
          events.trigger('profile-added', { $profile: profile });
        }
        else if (profileText) {
          events.trigger('invalid-profile', { $profile: profile });
        }

        return profile;
      };

      self.remove = function(index, event) {
        if (event) {
          event.stopPropagation();
        }
        var profile = self.items.splice(index, 1)[0];
        events.trigger('tag-removed', { $profile: profile });
        return profile;
      };

      self.profileClick = function(index) {
          var profile = self.items[index];
          events.trigger('profile-clicked', { $profile: profile });
      };

      self.removeLast = function() {
        var profile, lastProfileIndex = self.items.length - 1;

        if (self.selected) {
          self.selected = null;
          profile = self.remove(lastProfileIndex);
        }
        else if (!self.selected) {
          self.selected = self.items[lastProfileIndex];
        }

        return profile;
      };

      return self;
    }

    return {
      restrict: 'EA',
      require: '^ngModel',
      scope: {
        profiles: '=ngModel',
        onProfileAdded: '&',
        onProfileRemoved: '&',
        onProfileClicked: '&',
        onProfilesChanged: '&'
      },
      replace: false,
      transclude: true,
      templateUrl: 'js/directives/pz_profile_picker.html',

      controller: function($scope, $attrs, $element) {
          $scope.events = new EventEmitter();

          $scope.profileList = new ProfileList($scope.options, $scope.events);

          this.registerAutocomplete = function() {
              var input = $element.find('input');
              input.on('keydown', function(e) {
                $scope.events.trigger('input-keydown', e);
              });

            return {
              addProfile: function(profile) {
                return $scope.profileList.add(profile);
              },
              focusInput: function() {
                input[0].focus();
              },
              getProfiles: function() {
                return $scope.profiles;
              },
              getCurrentProfileText: function() {
                return $scope.newProfile.text;
              },
              getOptions: function() {
                return $scope.options;
              },
              on: function(name, handler) {
                $scope.events.on(name, handler);
                return this;
              }
            };
          };
      },


      link: function(scope, element, attrs, ngModelCtrl) {
          var hotkeys = [13, 188, 32, 8],
              profileList = scope.profileList,
              events = scope.events,
              input = element.find('input'),
              setElementValidity,
              addFromAutocompleteOnly = true;

          setElementValidity = function() {
            ngModelCtrl.$setValidity('minProfiles',   scope.profiles.length >= 1);
            ngModelCtrl.$setValidity('maxProfiles',   scope.profiles.length <= 9007199254740991); // hack!
            ngModelCtrl.$setValidity('leftoverText', !scope.newProfile.text);
          };

          // listen to component related events through the event emitter
          events
            .on('profile-added',   scope.onProfileAdded)
            .on('profile-removed', scope.onProfileRemoved)
            .on('profile-clicked', scope.onProfileClicked)
            .on('profile-added', function profileAdded() {
                scope.newProfile.text = '';
            })
            .on('profile-added profile-removed', function profileAddedRemoved() {
              if (ngModelCtrl) {
                 ngModelCtrl.$setViewValue(scope.profiles);
              }
              scope.onProfilesChanged();
              setElementValidity();
            })
            .on('invalid-profile', function invalidProfile() {
              scope.newProfile.invalid = true;
            })
            .on('input-change', function inputChange() {
              // clear selection when input is received
              profileList.selected = null;
              scope.newProfile.invalid = null;
            })
            .on('input-focus', function() {
              ngModelCtrl.$setValidity('leftoverText', true);
            })
            .on('option-change', function(e) {
              console.log('option-change, e: ', e.name);
            });

          // new profile base object
          scope.newProfile = {text: '', invalid: null};

          scope.getDisplayText = function(profile) {
            return profile['fullName'];
          };

          scope.track = function(profile) {
            if (profile.hasOwnProperty('id')) {
                return profile.id;
            }
            return profile['fullName'];
          };

          scope.newProfileChange = function() {
            events.trigger('input-change', scope.newProfile.text);
          };

          // watch for changes to the profiles list
          scope.$watch('profiles', function(value) {
            scope.profiles = makeObjectArray(value, 'fullName');
            profileList.items = scope.profiles;
          });

          scope.$watch('profiles.length', function() {
            setElementValidity();
          });

          // field input
          input
            .on('keydown', function(e) {
                if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                  console.log('stopped');
                  return;
                }

                var key = e.keyCode,
                  isModifier = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey,
                  addKeys = {},
                  shouldAdd, shouldRemove;

                if (isModifier || hotkeys.indexOf(key) === -1) {
                  return;
                }

                addKeys[13] = true;    // enter
                addKeys[188] = true;   // comma
                addKeys[32] = false;   // space

                shouldAdd = !addFromAutocompleteOnly && addKeys[key];
                shouldRemove = !shouldAdd && key === 8 && scope.newProfile.text.length === 0;

                if (shouldAdd) {
                  profileList.addText(scope.newProfile.text);

                  scope.$apply();
                  e.preventDefault();
                }
                else if (shouldRemove) {
                  var profile = profileList.removeLast();
                  if (profile) {
                    scope.newProfile.text = ''; // don't include the removed profile text
                  }

                  scope.$apply();
                  e.preventDefault();
                }
            })
            .on('focus', function() {
              if (scope.hasFocus) {
                return;
              }

              scope.hasFocus = true;
              events.trigger('input-focus');

              scope.$apply();
            })
            .on('blur', function() {
              $timeout(function() {
                var activeElement = $document.prop('activeElement'),
                  lostFocusToBrowserWindow = activeElement === input[0],
                  lostFocusToChildElement = element[0].contains(activeElement);

                if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
                  scope.hasFocus = false;
                  events.trigger('input-blur');
                }
              });
            });

          // focus the input field when the container div is clicked on
          element.find('div').on('click', function() {
            input[0].focus();
          });
        }
    };
  }]);
