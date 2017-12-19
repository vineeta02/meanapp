'use strict';

angular.module("ngAutocomplete", [])
    .directive('ngAutocomplete', ['$parse',
        function ($parse) {
          
            function convertPlaceToFriendlyObject(place) {
                var result,day,iterator,text,d = undefined;
                var reviews = [];
                var review_count = 0;
                if (place) {
                    result = {};
                    for (var i = 0, l = place.address_components.length; i < l; i++) {
                        if (i == 0) {
                            result.searchedBy = place.address_components[i].types[0];
                        }
                        result[place.address_components[i].types[0]] = place.address_components[i].long_name;
                    }
                    result.formattedAddress = place.formatted_address;
                    result.lat = place.geometry.location.lat();
                    result.lng = place.geometry.location.lng();
                    //result.phone = place.formatted_phone_number;
                    result.place_id = place.place_id;
                    //Get current day opening hours
                    if(place.opening_hours){
                        result.openinghours = place.opening_hours.weekday_text
                        d = new Date()
                        day = d.getDay()
                        if(day){
                            result.opening_hours = place.opening_hours.weekday_text[day-1] 
                        }
                        else
                            result.opening_hours = place.opening_hours.weekday_text[6]
                    } 
                    result.name = place.name;
                    if(place.rating){
                        result.rating = place.rating;
                    }
                    //Keeping up till 5 reviews of a place in the format "author name" : "reviews"
                    if(place.reviews){
                        for( iterator in place.reviews){
                            review_count ++
                            if(review_count > 5)
                                break;
                            text = place.reviews[iterator].author_name + " : " + place.reviews[iterator].text
                            reviews.push(text)
                        } 
                    }
                    result.reviews = reviews
                }
                return result;
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function ($scope, $element, $attrs, $ctrl) {
                    
                    if (!angular.isDefined($attrs.details)) {
                        throw '<ng-autocomplete> must have attribute [details] assigned to store full address object';
                    }

                    var getDetails = $parse($attrs.details);
                    var setDetails = getDetails.assign;
                    var getOptions = $parse($attrs.options);

                    //options for autocomplete
                    var opts;

                    //convert options provided to opts
                    var initOpts = function () {
                        opts = {};
                        if (angular.isDefined($attrs.options)) {
                            var options = getOptions($scope);
                            if (options.types) {
                                opts.types = [];
                                opts.types.push(options.types);
                            }
                            if (options.bounds) {
                                opts.bounds = options.bounds;
                            }
                            if (options.country) {
                                opts.componentRestrictions = {
                                    country: options.country
                                };
                            }
                        }
                    };

                    //create new autocomplete
                    //reinitializes on every change of the options provided
                    var newAutocomplete = function () {
                        var gPlace = new google.maps.places.Autocomplete($element[0], opts);
                        google.maps.event.addListener(gPlace, 'place_changed', function () {
                            $scope.$apply(function ($http) {
                                var place = gPlace.getPlace();
                                var details = convertPlaceToFriendlyObject(place);
                                setDetails($scope, details);
                                $ctrl.$setViewValue(details.formattedAddress);
                                $ctrl.$validate();
                            });
                            if ($ctrl.$valid && angular.isDefined($attrs.validateFn)) {
                                $scope.$apply(function () {
                                    $scope.$eval($attrs.validateFn);
                                });
                            }
                        });
                    };
                    newAutocomplete();


                    $ctrl.$validators.parse = function (value) {
                        var details = getDetails($scope);
                        var valid = ($attrs.required == true && details != undefined && details.lat != undefined) ||
                            (!$attrs.required && (details == undefined || details.lat == undefined) && $element.val() != '');
                        return valid;
                    };

                    $element.on('keypress', function (e) {
                        // prevent form submission on pressing Enter as there could be more inputs to fill out
                        if (e.which == 13) {
                            e.preventDefault();
                        }
                    });

                    //watch options provided to directive
                    if (angular.isDefined($attrs.options)) {
                        $scope.$watch($attrs.options, function() {
                            initOpts();
                            newAutocomplete();
                        });
                    }

                    // user typed something in the input - means an intention to change address, which is why
                    // we need to null out all fields for fresh validation
                    $element.on('keyup', function (e) {
                        //          chars 0-9, a-z                        numpad 0-9                   backspace         delete           space
                        if ((e.which >= 48 && e.which <= 90) || (e.which >= 96 && e.which <= 105) || e.which == 8 || e.which == 46 || e.which == 32) {
                            var details = getDetails($scope);
                            if (details != undefined) {
                                for (var property in details) {
                                    if (details.hasOwnProperty(property) && property != 'formattedAddress') {
                                        delete details[property];
                                    }
                                }
                                setDetails($scope, details);
                            }
                            if ($ctrl.$valid) {
                                $scope.$apply(function () {
                                    $ctrl.$setValidity('parse', false);
                                });
                            }
                        }
                    });
                }
            };
        }
    ]);
