 // The "stacktrace" library that we included in the Scripts
 // is now in the Global scope; but, we don't want to reference
 // global objects inside the AngularJS components - that's
 // not how AngularJS rolls; as such, we want to wrap the
 // stacktrace feature in a proper AngularJS service that
 // formally exposes the print method.

 (function() {
     'use strict';

     var esWebFramework = angular.module('es.Services.Web');
     esWebFramework.factory(
         "es.Services.StackTrace",
         function() {
             // "printStackTrace" is a global object.
             return ({
                 print: printStackTrace
             });
         }
     );

     esWebFramework.provider("$log",
         function() {
             var logAppenders = [];
             var ajaxAppender = null;

             function getLogger() {
                 return log4javascript.getLogger('esLogger');
             }

             function createDefaultAppenders() {
                 doaddAppender(new log4javascript.BrowserConsoleAppender());
                 doaddAppender(new log4javascript.PopUpAppender());
             }

             function setAccessToken(token)
             {
                if (!ajaxAppender) {
                    return;
                }

                var hd = ajaxAppender.getHeaders();
                if (hd) {
                    var i;
                    var foundIndex = -1;
                    for (i = 0; i < hd.length; i++) {
                        if (hd[i].name == "Authorization")
                        {
                            foundIndex = i;
                            break;
                        }
                    }
                    if (foundIndex != -1) {
                        hd.splice(foundIndex, 1);
                    }
                }

                if (token && token != "")
                {
                    ajaxAppender.addHeader("Authorization", token);
                }
             }

             function doaddAppender(appender) {
                 if (logAppenders.indexOf(appender) == -1) {
                     logAppenders.push(appender);
                     return true;
                 }
                 return false;
             }

             return {
                 addAppender: doaddAppender,

                 addDefaultAppenders: createDefaultAppenders,

                 addESWebApiAppender: function(srvUrl) {
                     // var ajaxUrl = srvUrl + "api/rpc/log/";
                     var ajaxUrl = srvUrl + "api/rpc/registerException/";
                     
                     ajaxAppender = new log4javascript.AjaxAppender(ajaxUrl, false);
                     ajaxAppender.setSendAllOnUnload(true);
                     ajaxAppender.setLayout( new log4javascript.JsonLayout() );
                     ajaxAppender.setWaitForResponse(true);
                     ajaxAppender.setBatchSize(100);
                     ajaxAppender.setTimed(true);
                     ajaxAppender.setTimerInterval(60000);
                     ajaxAppender.addHeader("Content-Type", "application/json");

                     ajaxAppender.setFailCallback(function(messg) {
                         console.error("Failed to POST Logs to the server", messg);
                     });
                     return doaddAppender(ajaxAppender);
                 },

                 $get: ['$injector', 
                     function($injector) {
                         try {

                             var logger = getLogger();
                             if (logAppenders.length == 0) {
                                 createDefaultAppenders();
                             }

                             var i = 0;
                             for (i = 0; i < logAppenders.length; i++) {
                                 logger.addAppender(logAppenders[i]);
                             }
                             console.info("ES Logger started");

                            // Extend the current logger object with ajaxAppender attributes
                             logger.updateAjaxToken = setAccessToken;
                             logger.sendAll = function()
                             {
                                try
                                {
                                    if (ajaxAppender) {
                                        ajaxAppender.sendAll();
                                    }
                                }
                                catch(exc) {

                                }
                             }

                             return logger;
                         } catch (exception) {
                             console.log("Error in starting entersoft logger", exception);
                             return $log;
                         }

                     }
                 ]
             }
         }

     );


     // -------------------------------------------------- //
     // -------------------------------------------------- //


     // By default, AngularJS will catch errors and log them to
     // the Console. We want to keep that behavior; however, we
     // want to intercept it so that we can also log the errors
     // to the server for later analysis.
     esWebFramework.provider("$exceptionHandler",
         function() {
             var logSettings = {
                 pushToServer: false,
                 logServer: ""
             };
             return {
                 getSettings: function() {
                     return logSettings;
                 },

                 setPushToServer: function(pushToServer) {
                     logSettings.pushToServer = pushToServer;
                 },

                 setLogServer: function(logServer) {
                     logSettings.logServer = logServer;
                 },

                 $get: ['$log', '$window', 'es.Services.StackTrace', '$injector',
                     function($log, $window, stacktraceService, $injector) {

                         // I log the given error to the remote server.
                         function log(exception, cause) {
                                 var errorMessage, stackTrace, itm;

                                 try {
                                     errorMessage = exception.toString();
                                     stackTrace = stacktraceService.print({
                                         e: exception
                                     });

                                     itm = {
                                         errorUrl: $window.location.href,
                                         errorMessage: errorMessage,
                                         stackTrace: stackTrace,
                                         cause: (cause || "")
                                     };

                                     $log.error(JSON.stringify(itm, null, '\t'));

                                 } catch (loggingError) {
                                     console.log(arguments);
                                 }

                                 if (logSettings.pushToServer) {
                                     // Now, we need to try and log the error the server.
                                     // --
                                     // NOTE: In production, I have some debouncing
                                     // logic here to prevent the same client from
                                     // logging the same error over and over again! All
                                     // that would do is add noise to the log.
                                     try {
                                         var ESWEBAPI = $injector.get('es.Services.WebApi');

                                         ESWEBAPI.registerException(itm, logSettings.logServer);

                                     } catch (loggingError) {

                                         // For Developers - log the log-failure.
                                         $log.warn("ES Error in registerException on store " + logSettings.logServer);
                                         $log.error(loggingError);

                                     }
                                 }

                             }
                             // Return the logging function.
                         return (log);
                     }
                 ]

             }
         }
     );
 })();
