(function() {
    'use strict';

    var esWebFramework = angular.module('es.Services.Web');

    esWebFramework.factory('es.Services.Globals', ['$sessionStorage',
        function($sessionStorage) {

            // Private variables//
            var esClientSession = {
                hostUrl: "",
                connectionModel: {},

                getWebApiToken: function() {
                    var model = getModel();
                    if (model) {
                        return 'Bearer ' + model.Model.WebApiToken;
                    }

                    return '';
                },

                setModel: function(model) {
                    connectionModel = model;
                    if (!model) {
                        delete $sessionStorage.__esrequest_sesssion;
                    } else {
                        $sessionStorage.__esrequest_sesssion = model;
                    }

                    $log.updateAjaxToken(model.Model.WebApiToken);
                },

                getModel: function() {
                    if (connectionModel) {
                        return connectionModel;
                    }

                    // check to see if session data are stored in the session storage so that 
                    // we can use this object as model
                    var inStorage = $sessionStorage;
                    if (typeof inStorage.__esrequest_sesssion !== 'undefined' && inStorage.__esrequest_sesssion !== null) {
                        session = inStorage.__esrequest_sesssion;
                    }

                    setModel(session);
                    return session;
                }
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
                	return;
                },

                sessionOpened: function(data) {
                    try {
                        esClientSession.setModel(data);

                        $log.info("LOGIN User ", data.Model.Name);

                    } catch (exc) {
                        $log.log.error(exc);
                        throw exc;
                    }
                }
            }

        }
    ]);

    esWebFramework.run(['$log', 'es.Services.Globals', function($log, esGlobals) {
        $log.updateAjaxToken(esGlobals.getWebApiToken());
    }]);

})();