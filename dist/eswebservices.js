
/***********************************
 * Entersoft SA
 * http://www.entersoft.eu
 * v0.0.0.5
 ***********************************/
 
(function() {
    'use strict';

    /* Services */

    var esWebServices = angular.module('esWebServices', ['ngStorage']);

    esWebServices.
    constant('ESWEBAPI_URL', {
        login:                  "api/Login",
        publicQuery:            "api/rpc/PublicQuery/",
        userSites:              "api/Login/Usersites",
        scrollerRootTable:      "api/rpc/SimpleScrollerRootTable/",
        newEntityAction:        "api/Entity/", 
        entityActionByCode:     "api/Entity/",
        entityActionByGID:      "api/EntityByGID/"
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

    esWebServices.provider("esWebApiService",
        function() {

            var esConfigSettings = {
                host: "",
                subscriptionId: "",
                subscriptionPassword: ""
            };

            return {
                settings: function(setting) {
                    if (angular.isDefined(setting)) {
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
                    } else {
                        return esConfigSettings;
                    }
                },
                $get: ['$http', '$sessionStorage', 'ESWEBAPI_URL', function($http, $sessionStorage, ESWEBAPI_URL) {
                    return {

                        login: function(credentials) {
                            delete $sessionStorage.__esrequest_sesssion;

                            return $http({
                                method: 'post',
                                url: esConfigSettings.host + ESWEBAPI_URL.login,
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
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.scrollerRootTable, GroupID, "/", FilterID);

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
                                url: esConfigSettings.host + ESWEBAPI_URL.userSites,
                                data: {
                                    SubscriptionID: esConfigSettings.subscriptionId,
                                    SubscriptionPassword: esConfigSettings.subscriptionPassword,
                                    Model: ebsuser
                                }
                            });
                        },

                        newEntityAction: function(entityType, entityObject, actionID) {
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.newEntityAction, entityType, "/", actionID);

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
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.entityActionByCode, entityType, "/", entityCode, "/", actionID);

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
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.entityActionByGID, entityType, "/", entityGID, "/", actionID);

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
                            var surl = esConfigSettings.host.concat(ESWEBAPI_URL.publicQuery, GroupID, "/", FilterID);

                            return $http({
                                method: 'get',
                                headers: {
                                    "Authorization": webAPIToken($sessionStorage)
                                },
                                url: surl,
                                data: Params
                            });
                        }
                    }
                }]
            }
        }
    );
}());

