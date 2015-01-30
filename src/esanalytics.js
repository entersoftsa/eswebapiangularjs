(function() {
    'use strict';

    var esModule = angular.module('es.Services.Analytics');
    esModule.provider("es.Services.GA",
        function() {
            var settings = {
                gaKey: undefined,
                pageTracking: {
                    autoTrackFirstPage: true,
                    autoTrackVirtualPages: true,
                    trackRelativePath: false,
                    autoBasePath: false,
                    basePath: ''
                },
                developerMode: false // Prevent sending data in local/development environment
            };

            return {
                setGAKey: function(key) {
                    gaKey = key;
                },
                settings: settings,
                virtualPageviews: function(value) {
                    this.settings.pageTracking.autoTrackVirtualPages = value;
                },
                firstPageview: function(value) {
                    this.settings.pageTracking.autoTrackFirstPage = value;
                },
                withBase: function(value) {
                    this.settings.pageTracking.basePath = (value) ? angular.element('base').attr('href').slice(0, -1) : '';
                },
                withAutoBase: function(value) {
                    this.settings.pageTracking.autoBasePath = value;
                },
                developerMode: function(value) {
                    this.settings.developerMode = value;
                },

                $get: ['$window', function($window) {
                    return {
                        create: function(key, domain) {
                            if ($window.ga) {
                                ga('create', Key, domain);
                            }
                        },

                        registerPageTrack: function(path) {
                            if ($window.ga) {
                                ga('send', 'pageview', path);
                            }
                        },

                        registerEventTrack: function(properties) {
                            if ($window.ga) {
                                // do nothing if there is no category (it's required by GA)
                                if (!properties || !properties.category) {
                                    return;
                                }
                                // GA requires that eventValue be an integer, see:
                                // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
                                // https://github.com/luisfarzati/angulartics/issues/81
                                if (properties.value) {
                                    var parsed = parseInt(properties.value, 10);
                                    properties.value = isNaN(parsed) ? 0 : parsed;
                                }

                                var eventOptions = {
                                    eventCategory: properties.category || null,
                                    eventAction: properties.action || null,
                                    eventLabel: properties.label || null,
                                    eventValue: properties.value || null,
                                    nonInteraction: properties.noninteraction || null
                                };

                                // add custom dimensions and metrics
                                for (var idx = 1; idx <= 20; idx++) {
                                    if (properties['dimension' + idx.toString()]) {
                                        eventOptions['dimension' + idx.toString()] = properties['dimension' + idx.toString()];
                                    }
                                    if (properties['metric' + idx.toString()]) {
                                        eventOptions['metric' + idx.toString()] = properties['metric' + idx.toString()];
                                    }
                                }
                                ga('send', 'event', eventOptions);
                                angular.forEach($analyticsProvider.settings.ga.additionalAccountNames, function(accountName) {
                                    ga(accountName + '.send', 'event', eventOptions);
                                });

                            }
                        }
                    }
                }]

            };

        }
    );

    esModule.run(['$rootScope', '$window', 'es.Services.GA', '$injector', function($rootScope, $window, esAnalytics, $injector) {
        if (esAnalytics.settings.pageTracking.autoTrackFirstPage) {
            $injector.invoke(['$location', function($location) {
                /* Only track the 'first page' if there are no routes or states on the page */
                var noRoutesOrStates = true;
                if ($injector.has('$route')) {
                    var $route = $injector.get('$route');
                    for (var route in $route.routes) {
                        noRoutesOrStates = false;
                        break;
                    }
                } else if ($injector.has('$state')) {
                    var $state = $injector.get('$state');
                    for (var state in $state.get()) {
                        noRoutesOrStates = false;
                        break;
                    }
                }
                if (noRoutesOrStates) {
                    if (esAnalytics.settings.pageTracking.autoBasePath) {
                        esAnalytics.settings.pageTracking.basePath = $window.location.pathname;
                    }
                    if (esAnalytics.settings.trackRelativePath) {
                        var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                        esAnalytics.pageTrack(url, $location);
                    } else {
                        esAnalytics.pageTrack($location.absUrl(), $location);
                    }
                }
            }]);
        }

        if (esAnalytics.settings.pageTracking.autoTrackVirtualPages) {
            $injector.invoke(['$location', function($location) {
                if (esAnalytics.settings.pageTracking.autoBasePath) {
                    /* Add the full route to the base. */
                    esAnalytics.settings.pageTracking.basePath = $window.location.pathname + "#";
                }
                if ($injector.has('$route')) {
                    $rootScope.$on('$routeChangeSuccess', function(event, current) {
                        if (current && (current.$$route || current).redirectTo) return;
                        var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                        esAnalytics.pageTrack(url, $location);
                    });
                }
                if ($injector.has('$state')) {
                    $rootScope.$on('$stateChangeSuccess', function(event, current) {
                        var url = esAnalytics.settings.pageTracking.basePath + $location.url();
                        esAnalytics.pageTrack(url, $location);
                    });
                }
            }]);
        }
        if (esAnalytics.settings.developerMode) {
            angular.forEach(esAnalytics, function(attr, name) {
                if (typeof attr === 'function') {
                    esAnalytics[name] = function() {};
                }
            });
        }
    }]);


    esModule.directive('esAnalytics', ['$rootScope', '$location', 'es.Services.GA',
        function($rootScope, $location, esGA) {
            return {
                link: function(scope, elem, attrs, ctrl) {

                    $rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) {
                        var s;

                        if (angular.isUndefined(attrs.esAnalyticsLocation)) {
                            s = $location.path();
                        } else {
                            s = attrs.esAnalyticsLocation;
                        }
                        //esGA('set', 'page', s);
                        //esGA('send', 'pageview');
                    });
                }
            }
        }
    ]);

})();
