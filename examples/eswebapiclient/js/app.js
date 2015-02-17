(function(angular, noty) {
    var eskbApp = angular.module('eskbApp', [

        /* angular modules */
        'ngRoute',
        'ngStorage',

        'es.Services.Analytics',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',

        'eskbControllers',
        'es.Services.Social'
    ]);

    eskbApp.config(['$logProvider', 
        '$httpProvider', 
        '$routeProvider', 
        'es.Services.WebApiProvider', 
        '$exceptionHandlerProvider', 
        'es.Services.GAProvider',
        'esFacebookProvider',
        function($logProvider, $httpProvider, $routeProvider, esWebApiServiceProvider, $exceptionHandlerProvider, esAnalyticsProvider, esFacebookProvider) {

            var interceptor = ['$q', '$sessionStorage', '$timeout', '$location', function($q, $sessionStorage, $timeout, $location) {
                var httpHandlers = {
                    401: function() {
                        delete $sessionStorage.__esrequest_sesssion;
                        $location.path("/");
                    }
                };

                return {
                    request: function(config) {
                        return config;
                    },

                    response: function(response) {
                        return response;
                    },

                    responseError: function(rejection) {

                        if (httpHandlers.hasOwnProperty(rejection.status)) {
                            httpHandlers[rejection.status].call(rejection);
                        }

                        return $q.reject(rejection);
                    }
                };
            }];
            $httpProvider.interceptors.push(interceptor);

            esAnalyticsProvider.start("UA-50505865-9", {'cookieDomain': 'none'});

            esFacebookProvider.init('867319009980781');

            $logProvider.addDefaultAppenders();

            $exceptionHandlerProvider.setPushToServer(true);
            $exceptionHandlerProvider.setLogServer("Azure");

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                // host: "eswebapialp.azurewebsites.net",
                host: "eswebapi.entersoft.gr",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });

            $logProvider.addESWebApiAppender(esWebApiServiceProvider.getServerUrl(), subscriptionId);

            $routeProvider.
            when('/', {
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl',
                seo: "abcd"
            }).
            when('/fb', {
                templateUrl: 'partials/esfb.html',
                seo: "xyz"
            }).
            when('/scroller', {
                templateUrl: 'partials/scroller.html',
                controller: 'scrollerCtrl',
                seo: "xyz"
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);
    
})(window.angular, window.noty);
