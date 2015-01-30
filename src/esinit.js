(function() {
    'use strict';

    var esWebFramework = angular.module('es.Services.Web');

    function getGA($injector) {
        if (!$injector) {
            return undefined;
        }

        try {
            return $injector.get('es.Services.GA');
        } catch(x) {
            return undefined;
        }

    }

    // Define the factory on the module.
    // Inject the dependencies.
    // Point to the factory definition function.
    esWebFramework.factory('es.Services.Messaging', function() {
        //#region Internal Properties
        var cache = {};

        //#endregion

        //#region Internal Methods
        function publish() {
            if (!arguments || arguments.Length < 1) {
                throw "Publishing events requires at least one argument for topic id";
            }

            var topic = arguments[0];
            var restArgs = Array.prototype.slice.call(arguments, 1);

            cache[topic] && angular.forEach(cache[topic], function(callback) {
                try {
                    callback.apply(null, restArgs);
                } catch (exc) {
                    console.log("Error in messaging handler for topic ", topic);
                }
            });
        }

        function subscribe(topic, callback) {
            if (!cache[topic]) {
                cache[topic] = [];
            }
            cache[topic].push(callback);
            return [topic, callback];
        }

        function unsubscribe(handle) {
            var t = handle[0];
            cache[t] && angular.forEach(cache[t], function(idx) {
                if (this == handle[1]) {
                    cache[t].splice(idx, 1);
                }
            });
        }

        //#endregion

        // Define the functions and properties to reveal.
        var service = {
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };

        return service;
    });


    esWebFramework.factory('es.Services.Globals', ['$sessionStorage', '$log', 'es.Services.Messaging', '$injector' /* 'es.Services.GA' */ ,
        function($sessionStorage, $log, esMessaging, $injector) {

            function fgetModel() {
                if (!esClientSession.connectionModel) {

                    // check to see if session data are stored in the session storage so that 
                    // we can use this object as model
                    var inStorage = $sessionStorage;
                    var session = null;
                    if (typeof inStorage.__esrequest_sesssion !== 'undefined' && inStorage.__esrequest_sesssion !== null) {
                        session = inStorage.__esrequest_sesssion;
                        esClientSession.connectionModel = session;

                        esMessaging.publish("AUTH_CHANGED", esClientSession, getAuthToken(session));

                        var esga = getGA($injector);
                        if (angular.isDefined(esga)) {
                            var i;
                            for (i = 0; i < 12; i++) {
                                if (angular.isDefined(esga)) {
                                    esga.registerEventTrack({
                                        category: 'AUTH',
                                        action: 'RELOGIN',
                                        label: esClientSession.connectionModel.GID
                                    });
                                }
                            }
                        }

                        $log.info("RELOGIN User ", esClientSession.connectionModel.Name);
                    } else {
                        esMessaging.publish("AUTH_CHANGED", null, getAuthToken(null));
                        $log.info("NO RELOGIN from stored state");
                    }
                }

                return esClientSession.connectionModel;
            }

            function fsetModel(model) {
                esClientSession.connectionModel = model;
                if (!model) {
                    delete $sessionStorage.__esrequest_sesssion;
                } else {
                    $sessionStorage.__esrequest_sesssion = model;
                }

                esMessaging.publish("AUTH_CHANGED", esClientSession, getAuthToken(model));
            }

            function getAuthToken(model) {
                if (model) {
                    return 'Bearer ' + model.WebApiToken;
                }
                return '';
            }

            // Private variables//
            var esClientSession = {
                hostUrl: "",
                credentials: null,
                connectionModel: null,

                getWebApiToken: function() {
                    return getAuthToken(fgetModel());
                },

                setModel: fsetModel,

                getModel: fgetModel
            };



            return {

                getWebApiToken: function() {
                    return esClientSession.getWebApiToken();
                },

                getClientSession: function() {
                    return esClientSession;
                },

                sessionClosed: function() {
                    esClientSession.setModel(null);
                },

                sessionOpened: function(data, credentials) {
                    try {
                        esClientSession.setModel(data.Model);
                        esClientSession.credentials = credentials;


                        var esga = getGA($injector);
                        if (angular.isDefined(esga)) {
                            var i;
                            for (i = 0; i < 12; i++) {
                                if (angular.isDefined(esga)) {
                                    esga.registerEventTrack({
                                        category: 'AUTH',
                                        action: 'LOGIN',
                                        label: data.Model.GID
                                    });
                                }
                            }
                        }

                        $log.info("LOGIN User ", data.Model.Name);

                    } catch (exc) {
                        $log.error(exc);
                        throw exc;
                    }
                }
            }

        }
    ]);


    esWebFramework.run(['es.Services.Globals', 'es.Services.WebApi', function(esGlobals, esWebApi) {
        var esSession = esGlobals.getClientSession();
        esSession.getModel();
        esSession.hostUrl = esWebApi.getServerUrl();
    }]);
})();
