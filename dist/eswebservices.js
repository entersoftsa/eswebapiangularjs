/***********************************
 * Entersoft SA
 * http://www.entersoft.eu
 * v0.0.6
 * 
 ***********************************/

(function() {
    'use strict';

    /* Services */

    var esWebServices = angular.module('es.Services.Web', ['ngStorage', 'ngSanitize']);

    esWebServices.
    constant('ESWEBAPI_URL', {
        __LOGIN__: "api/Login",
        __PUBLICQUERY__: "api/rpc/PublicQuery/",
        __USERSITES__: "api/Login/Usersites",
        __SCROLLERROOTTABLE__: "api/rpc/SimpleScrollerRootTable/",
        __ENTITYACTION__: "api/Entity/",
        __ENTITYBYGIDACTION__: "api/EntityByGID/",
        __ELASTICSEARCH__: "api/esearch/"
    });


    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function webAPIToken(inStorage) {
        var session = false;

        //pass token for protected pages
        if (typeof inStorage.__esrequest_sesssion !== 'undefined' && inStorage.__esrequest_sesssion !== null) {
            session = inStorage.__esrequest_sesssion;
        }

        if (session) {
            return 'Bearer ' + session.WebApiToken;
        } else {
            return '';
        }
    }

    esWebServices.provider("es.Services.WebApi",
        function() {

            var esConfigSettings = {
                host: "",
                subscriptionId: "",
                subscriptionPassword: ""
            };

            return {
                getSettings: function() {
                    return esConfigSettings;
                },

                setSettings: function(setting) {
                    esConfigSettings = setting;
                    if (!esConfigSettings.host || esConfigSettings.host.trim() == "") {
                        throw "host for Entersoft WEB API Server is not specified";
                    }

                    if (esConfigSettings.host) {
                        esConfigSettings.host = esConfigSettings.host.trim();

                        if (!endsWith(esConfigSettings.host, "/")) {
                            esConfigSettings.host += "/";
                        }
                    }
                    return this;
                },
                $get: ['$http', '$log', '$sessionStorage', 'ESWEBAPI_URL', function($http, $log, $sessionStorage, ESWEBAPI_URL) {
                    return {

                        login: function(credentials) {
                            delete $sessionStorage.__esrequest_sesssion;

                            return $http({
                                method: 'post',
                                url: esConfigSettings.host + ESWEBAPI_URL.__LOGIN__,
                                data: {
                                    SubscriptionID: esConfigSettings.subscriptionId,
                                    SubscriptionPassword: esConfigSettings.subscriptionPassword,
                                    Model: credentials
                                }
                            });
                        },

                        setUser: function(data) {
                            var tok = data.Model;
                            $sessionStorage.__esrequest_sesssion = tok;
                        },

                        scrollerRootTable: function(GroupID, FilterID, Params) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__SCROLLERROOTTABLE__, GroupID, "/", FilterID);

                            return $http({
                                method: 'get',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: Params
                            });
                        },

                        userSites: function(ebsuser) {
                            return $http({
                                method: 'post',
                                url: esConfigSettings.host + ESWEBAPI_URL.__USERSITES__,
                                data: {
                                    SubscriptionID: esConfigSettings.subscriptionId,
                                    SubscriptionPassword: esConfigSettings.subscriptionPassword,
                                    Model: ebsuser
                                }
                            });
                        },

                        newEntityAction: function(entityType, entityObject, actionID) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", actionID);

                            return $http({
                                method: 'post',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: entityObject
                            });

                        },

                        entityActionByCode: function(entityType, entityCode, entityObject, actionID) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__ENTITYACTION__, entityType, "/", entityCode, "/", actionID);

                            return $http({
                                method: 'post',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: entityObject
                            });

                        },

                        entityActionByGID: function(entityType, entityGID, entityObject, actionID) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__ENTITYBYGIDACTION__, entityType, "/", entityGID, "/", actionID);

                            return $http({
                                method: 'post',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: entityObject
                            });

                        },

                        publicQuery: function(GroupID, FilterID, Params) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__PUBLICQUERY__, GroupID, "/", FilterID);

                            return $http({
                                method: 'get',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: Params
                            });
                        },

                        eSearch: function(eUrl, eMethod, eBody) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.__ELASTICSEARCH__, eUrl);

                            return $http({
                                method: eMethod,
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: eBody
                            });
                        }
                    }
                }]
            }
        }
    );

    esWebServices.factory('es.Services.ElasticSearch', ['es.Services.WebApi',
        function(esWebApi) {
            return {
                searchIndex: function(index, body) {
                    var eUrl = index + "/_search";
                    return esWebApi.eSearch(eUrl, "post", body);
                },

                searchIndexAndDocument: function(index, docType, body) {
                    var eUrl = index + "/" + docType + "/_search";
                    return esWebApi.eSearch(eUrl, "post", body);
                },

                searchFree: esWebApi.eSearch
            };
        }
    ]);

}());
