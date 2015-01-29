/**
* @module  es.Services.Web#radio 
* @author  G. D. Mermigkas
* @version 0.0.1
*
* @description
*  Provides a high level api for managing angular publish / subscribe events in a mor uniform way. It makes use of the global
*  $rootScope object (single point of entry for any controller, service, directive in a single angular application) to abstract event
*  subscriptions under duck-typed methods. That way we keep our event namepsaces clean and uniform.
*
* For example
*
* <pre>
* ===========================
* Without Angular Radio
* ===========================
*
*       //content of myController.js
*       function myController($scope, $rootScope) {
*           var clean = function () { ...do some cleanup }
*           $scope.exit = function () {
*               $rootScope.$broadcast('exit:button:click', clean)
*           };
*       }
*
*       //content of  myDirective.js
*       function myDirective() {
*           return {
*               restrict: 'A',
*               link: function () {
*                   $rootScope.on('exit:button:click', function ($event, cleanUp) {
*                       cleanUp() //do some cleanup
*                   })
*               }
*           }
*       }
*
* ===========================
* With Angular Radio
* ===========================
*       //content of myController.js
*       function myController($scope, Radio) {
*           Radio.setupEvent('popup', 'exit');
*           $scope.exit = function () {
*               Radio.popup.raise.exit(clean)
*           }
*       }
*
*       //content of  myDirective.js
*       function myDirective(Radio) {
*           return {
*               restrict: 'A',
*               link: function () {
*                   Radio.popup.on.exit(function (cleanUp) {
*                       cleanUp() //do some cleanup
*                   })
*               }
*           }
*       }
*
*  See more examples at ../tests/radio.html
* </pre>
*  
*/
angular.module('es.Services.Web.Radio', []).
provider('Radio', function () {

    /**
     * todo: Allow setUp of events during config phase of the application
     * todo: Write some unit tests
     * todo: Allow mixin with an angular user defined service
     */

    /**
     * PRIVATE MEMBERS
     * Declare configurable properties here. These properties can be canfigured PRIOR to
     * injection using the delegated methods of the provider. Once the provider is instantiated the properties
     * here will live in a closure which is unique for each instance.
     * WARNING: Private members in JS can be emulated in closuires but at a cost. Each instance will carry its
     * own closure (i.e no prototype leverage here) and therefore memory concerns should apply here
     */

     /**
      * holds the names for our publish / subscribe methods
      * @private @type {Array}
      */
     var radioMethods = ['on', 'raise'];

     /**
      * @private
      * @ngdoc function
      * @name  registerEvent
      * @param {AngularScopeObject} scope - can be either a directive or controller $scope or the global $rootScope object
      * @param {string} eventId - a unique eventId to use for applying our subscription (this is handled internally)
      * @param {callback} handler - the callback function to execute on this subscription
      * @description 
      * Register an event on a scope.
      */
    function _registerEvent(scope, eventId, handler) {
        var on = (scope.$on) ? '$on' : 'on';
        return scope[on](eventId, function(event) {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1); //remove evt argument
            handler.apply(this, args);
        });
    }

    return {
        /**
         * configuration methods here
         * These will be used as static methods to configure private properties of our class.
         * Angular will then instantiate the provider using the "new" keyword and call the $get
         * method automatically. It is the return object of the $get method that gets injected
         * into an angular service / controller when using DI.
         */
        
         /**
          * set custom names for the methods that publich / subscribe an event channel
          * @public @static setRadioMethods
          * @param {string} onMethod e.g 'subscribe'
          * @param {string} raiseMethod e.g 'publish' 
          */
         setRadioMethods: function (onMethod, raiseMethod) {
            radioMethods = [onMethod, raiseMethod];
         },

        $get: ['$rootScope', function ($rootScope) {

            /**
             * Public api here. The object returned here is the injected object
             */
            return {

                listeners: [],

                /**
                 * setup event publish / subscribe methods
                 * @param  {string} namespace - organise event in namespaces
                 * @param  {string} eventName - the eventName will be used as a method that is called on the namespace
                 * @return {RadioInstance} - the injected instance from angular's $injector    
                 * @this refers to the injected instance
                 */
                setupEvent: function (namespace, eventName) {
                    var self = this;
                    var feature;
                    var eventId;
                    var on, raise;
                    self.listeners = [];

                    //create the event namespace if not exist
                    if (!self[namespace]) {
                        self[namespace] = {};
                    }

                    //create the pub / sub methods
                    feature = self[namespace];
                    //if any of the two pubsub methods is not a property of the namespace then create them
                    if (!feature[radioMethods[0]]) {
                        for (var i=0,_len = radioMethods.length; i < _len; i++) {
                            feature[radioMethods[i]] = {};
                        }
                    }

                    //cache the methods
                    on = radioMethods[0];
                    raise = radioMethods[1];
                    eventId = namespace + ':' + eventName;

                    //create the raise method
                    feature[raise][eventName] = function () {
                        $rootScope.$broadcast.apply($rootScope, [eventId].concat(Array.prototype.slice.call(arguments)));
                    };

                    //create a subscription method
                    feature[on][eventName] = function(scope, handler) {
                        var _handler, dereg;

                        //allow optional scope argument. When scope is not passed,
                        //$rootScope is used instead
                        if (arguments.length < 2) {
                            _handler = scope;
                             scope = $rootScope;
                             handler = _handler;
                        }
                        dereg = _registerEvent(scope, eventId, handler, self);

                        //track our listener so we can turn off and on
                        var listener = {
                            handler: handler,
                            dereg: dereg,
                            eventId: eventId,
                            scope: scope
                        };
                        self.listeners.push(listener);
                    };

                }, //setupEvent

                /**
                 * list the event subscription namespaces
                 * @return {array} a list of subscribers
                 */
                listSubscribers: function () {
                    return this.listeners.reduce(function(memo, listener, index, array) {
                        memo.push(listener.eventId.split(':')[0]);
                        return memo;
                    }, []);
                },

                /**
                 * given a namespace, it returns all methods under this namespace
                 * @param  {string} subscriber - an event namespace
                 * @return {array} - a list of available method subscriptions under this namespace
                 */
                listSubscriberMethods: function (subscriber) {
                    return this.listeners.reduce(function (memo, listener) {
                       if (subscriber === listener.eventId.split(':')[0]) memo.push(listener.eventId.split(':')[1]);
                       return memo;
                    }, []);
                }
            };
        }]
    };
});