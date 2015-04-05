'use strict';

/* Controllers */

var eskbControllers = angular.module('eskbControllers', ['kendo.directives', 'es.Services.Social', 'underscore']);

eskbControllers.controller('mainCtrl', ['$scope', '$rootScope', 'es.Services.WebApi', 'es.Services.Globals', '$location', 'es.Services.Messaging',
    function($scope, $rootScope, esWebApiService, esGlobals, $location, esMessaging) {

        $scope.currentUser = {};

        esMessaging.subscribe("AUTH_CHANGED", function(session, tok) {
            if (session && session.connectionModel) {
                $scope.currentUser.Name = session.connectionModel.Name;
            } else {
                $scope.currentUser.Name = '';
            }
        });

        $scope.logout = function() {
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
                    var msg = rejection ? rejection.UserMessage : "Generic server error";
                    noty({
                        text: msg,
                        type: 'error',
                        timeout: 3000,
                        killer: true
                    });
                });
        }
    }
]);

eskbControllers.controller('fbCtrl', ['$scope', 'esFacebook', function($scope, esFB) {
    $scope.loginStatus = 'disconnected';
    $scope.facebookIsReady = false;
    $scope.user = null;
    $scope.login = function() {
        esFB.login(function(response) {
            $scope.loginStatus = response.status;
        }, {
            scope: 'email'
        });
    };

    $scope.logout = function() {
        esFB.logout(function(response) {
            $scope.loginStatus = response.status;
        });
    };
    $scope.removeAuth = function() {
        esFB.api({
            method: 'Auth.revokeAuthorization'
        }, function(response) {
            esFB.getLoginStatus(function(response) {
                $scope.loginStatus = response.status;
            });
        });
    };
    $scope.api = function() {
        esFB.api('/me', function(response) {
            $scope.user = response;
        });
    };
    $scope.$watch(function() {
        return esFB.isReady();
    }, function(newVal) {
        if (newVal) {
            $scope.facebookIsReady = true;
        }
    });

}]);

eskbControllers.controller('scrollerCtrl', ['$scope', '$log', '$http', 'es.Services.WebApi', '_', 'es.Services.Cache',
    function($scope, $log, $http, esWebApiService, _, cache) {

        $scope.GroupID = "ESTMTask";
        $scope.FilterID = "RequestsToBeApproved";
        $scope.PQResults = {};
        $scope.gridOptions = {};
        $scope.ChartData = {};

        $scope.onSeriesClick = function(e) {
            alert("Name = " + e.series.name + "Value = " + e.value);
        }

        $scope.executePQ = function() {

            var companyParams = cache.getItem("ESParams");
            if (!companyParams) {
                esWebApiService.fetchCompanyParams()
                    .success(function(x) {
                        cache.setItem("ESParams", x);
                        $log.info(x);
                    });
            } else {
                $log.info("Found Params in cache " + companyParams.length + " elements");
            }


            $scope.PQResults = cache.getItem("DS");
            if ($scope.PQResults) {
                return;
            }

            esWebApiService.fetchPublicQuery($scope.GroupID, $scope.FilterID, {})
                .success(function(pq) {
                    $scope.PQResults = pq;
                    cache.setItem("DS", pq, {
                        expirationAbsolute: null,
                        expirationSliding: 10,
                        priority: Cache.Priority.HIGH
                    });

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

        $scope.mainGridOptions = function(dt) {

            return {
                dataSource: {
                    data: dt,
                    pageSize: 5
                },
                sortable: true,
                pageable: true,
                columns: $scope.getColumnDefinitions(dt)
            };
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