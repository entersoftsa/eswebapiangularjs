'use strict';

/* Controllers */

var eskbControllers = angular.module('eskbControllers', ['kendo.directives']);

eskbControllers.controller('mainCtrl', ['$scope', '$rootScope', 'es.Services.WebApi', 'es.Services.Globals', '$location',
    function($scope, $rootScope, esWebApiService, esGlobals, $location) {

        $scope.logout = function()
        {
            esWebApiService.logout();
            $location.path('/login');
        }
    }
]);


eskbControllers.controller('loginCtrl', ['$scope', '$rootScope', 'es.Services.WebApi', '$location',
    function($scope, $rootScope, esWebApiService, $location) {
        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.doLogin = function() {
            esWebApiService.openSession($scope.credentials)
                .success(function($user, status, headers, config) {
                    $location.path('/scroller');
                })
                .error(function(rejection) {
                    noty({
                        text: rejection.UserMessage,
                        type: 'error',
                        timeout: 3000,
                        killer: true
                    });
                });
        }
    }
]);


eskbControllers.controller('scrollerCtrl', ['$scope', '$log', '$http', 'es.Services.WebApi',
    function($scope, $log, $http, esWebApiService) {

        $scope.GroupID = "ESTMTask";
        $scope.FilterID = "RequestsToBeApproved";
        $scope.PQResults = {};
        $scope.gridOptions = {};

        $scope.executePQ = function() {
            esWebApiService.fetchPublicQuery($scope.GroupID, $scope.FilterID, {})
                .success(function(pq) {
                    $scope.PQResults = pq;

                    $log.info('PublicQuery OK! ' + Object.keys(pq).length);
                    for (var key in pq) {
                        $log.info('  ' + key + ' -> ' + pq[key].length);
                    }

                })
                .error(function(rejection) {
                    $scope.PQResults = {};
                    $scope.gridOptions = {};

                    noty({
                        text: rejection.UserMessage,
                        type: 'error',
                        timeout: 3000,
                        killer: true
                    });
                })
        }


        $scope.getColumnDefinitions = function(dt) {
            var kendocols = [];

            var dtCols = Object.keys(dt[0]);
            var mx = Math.min(5, dtCols.length);
            var index;

            for (index = 0; index < mx; index++) {
                kendocols.push({
                    field: dtCols[index],
                    title: dtCols[index]
                });
            }

            return kendocols;

        }
    }
]);