(function() {
    'use strict';

    var esWebFramework = angular.module('es.Services.Web');

    esWebFramework.factory('es.Services.Globals', ['$sessionStorage', '$log',
        function($sessionStorage, $log) {

            function fgetModel() {
                if (!esClientSession.connectionModel) {

                    // check to see if session data are stored in the session storage so that 
                    // we can use this object as model
                    var inStorage = $sessionStorage;
                    var session = null;
                    if (typeof inStorage.__esrequest_sesssion !== 'undefined' && inStorage.__esrequest_sesssion !== null) {
                        session = inStorage.__esrequest_sesssion;
                        esClientSession.connectionModel = session;
                        $log.info("RELOGIN User ", esClientSession.connectionModel.Name);
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

                $log.updateAjaxToken(getAuthToken(model));
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

                sessionOpened: function(data) {
                    try {
                        esClientSession.setModel(data.Model);

                        $log.info("LOGIN User ", data.Model.Name);

                    } catch (exc) {
                        $log.error(exc);
                        throw exc;
                    }
                }
            }

        }
    ]);


    esWebFramework.run(['$log', 'es.Services.Globals', 'es.Services.WebApi', function($log, esGlobals, esWebApi) {
        $log.updateAjaxToken(esGlobals.getWebApiToken());
        esGlobals.getClientSession().hostUrl = esWebApi.getServerUrl();
    }]);


})();
