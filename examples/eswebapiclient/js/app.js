(function(angular, noty) {
    var eskbApp = angular.module('eskbApp', [

        /* angular modules */
        'ngRoute',
        'ngStorage',

        /* Entersoft AngularJS WEB API Provider */
        'es.Services.Web',

        /* Application Modules */

        'eskbControllers'
    ]);

    eskbApp.config(['$logProvider', 
        '$httpProvider', 
        '$routeProvider', 
        'es.Services.WebApiProvider', 
        '$exceptionHandlerProvider', 
        'es.Services.GAProvider', 
        '$windowProvider',
        function($logProvider, $httpProvider, $routeProvider, esWebApiServiceProvider, $exceptionHandlerProvider, esGAProvider, $windowProvider) {

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

            esGAProvider.create($windowProvider.$get(), "UA-50505865-9", {'cookieDomain': 'none'});

            $logProvider.addDefaultAppenders();

            $exceptionHandlerProvider.setPushToServer(true);
            $exceptionHandlerProvider.setLogServer("Azure");

            var subscriptionId = "";
            esWebApiServiceProvider.setSettings({
                host: "eswebapialp.azurewebsites.net",
                subscriptionId: subscriptionId,
                subscriptionPassword: "passx",
                allowUnsecureConnection: false
            });

            $logProvider.addESWebApiAppender(esWebApiServiceProvider.getServerUrl(), subscriptionId);

            $routeProvider.
            when('/', {
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            }).
            when('/scroller', {
                templateUrl: 'partials/scroller.html',
                controller: 'scrollerCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);

    
})(window.angular, window.noty);