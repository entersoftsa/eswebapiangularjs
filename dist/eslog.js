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
                 logLevel: 0
             };
             return {
                 getSettings: function() {
                     return logSettings;
                 },

                 setPushToServer: function(pushToServer) {
                     logSettings.pushToServer = pushToServer;
                 },

                 setLogLevel: function(logLevel) {
                     logSettings.logLevel = logLevel;
                 },

                 $get: ['es.Services.logService', function(errorLogService) {
                     return (errorLogService);
                 }]
             }
         }
     );


     // -------------------------------------------------- //
     // -------------------------------------------------- //


     // The error log service is our wrapper around the core error
     // handling ability of AngularJS. Notice that we pass off to
     // the native "$log" method and then handle our additional
     // server-side logging.
     esWebFramework.factory("es.Services.logService", ['$log', '$window', 'es.Services.StackTrace', '$injector',
         function($log, $window, stacktraceService, $injector, $exceptionHandler) {

             // I log the given error to the remote server.
             function log(exception, cause) {

                     // Pass off the error to the default error handler
                     // on the AngualrJS logger. This will output the
                     // error to the console (and let the application
                     // keep running normally for the user).
                     $log.error.apply($log, arguments);

                     var exceptionHandler = $injector.get('$exceptionHandler');
                     if (exceptionHandler) {
                         var st = exceptionHandler.getSettings();

                         if (st && st.pushToServer) {
                             // Now, we need to try and log the error the server.
                             // --
                             // NOTE: In production, I have some debouncing
                             // logic here to prevent the same client from
                             // logging the same error over and over again! All
                             // that would do is add noise to the log.
                             try {
                                 var errorMessage = exception.toString();
                                 var stackTrace = stacktraceService.print({
                                     e: exception
                                 });

                                 var ESWEBAPI = $injector.get('es.Services.WebApi');

                                 var itm = {
                                     errorUrl: $window.location.href,
                                     errorMessage: errorMessage,
                                     stackTrace: stackTrace,
                                     cause: (cause || "")
                                 };

                                 ESWEBAPI.esLog(itm);
                                 console.log(angular.toJson(itm));

                             } catch (loggingError) {

                                 // For Developers - log the log-failure.
                                 $log.warn("Error logging failed");
                                 $log.log(loggingError);

                             }
                         }
                     }
                 }
                 // Return the logging function.
             return (log);
         }
     ]);
 })();
