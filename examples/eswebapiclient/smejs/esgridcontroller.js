'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);




smeControllers.controller('esPQCtrl', ['$timeout', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($timeout, $scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging) {

        $scope.currentUser = {};
        $scope.gridOptions = null;
        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESFICustomer";
        $scope.FilterID = "hka_customerlist";
        //$scope.gridOptions = null;
        $scope.pVals = {};
        $scope.pqInfo = {};

        function onChange(arg) {
            debugger;
            kendoConsole.log("Grid change");
        }

        function onDataBound(arg) {
            debugger;
            kendoConsole.log("Grid data bound");
        }

        function onDataBinding(arg) {
            debugger;
            kendoConsole.log("Grid data binding");
        }

        $scope.xChange = onChange;
        $scope.xDBound = onDataBound;
        $scope.xDBinding = onDataBinding;

        esMessaging.subscribe("AUTH_CHANGED", function(session, tok) {
            if (session && session.connectionModel) {
                $scope.currentUser.Name = session.connectionModel.Name;
            } else {
                $scope.currentUser.Name = 'NOT Approved';
            }
        });

        esWebApiService.openSession($scope.credentials)
            .success(function($user, status, headers, config) {
                console.log("Logged in. Ready to proceed");
                esWebApiService.fetchPublicQueryInfo($scope.GroupID, $scope.FilterID)
                    .success(function(ret) {
                        $timeout(function() {
                            var v = esWebUIHelper.winGridInfoToESGridInfo($scope.GroupID, $scope.FilterID, ret);
                            angular.extend($scope.pVals, v.defaultValues);

                            $scope.gridOptions = esWebUIHelper.esGridInfoToKInfo(esWebApiService, $scope.GroupID, $scope.FilterID, $scope.pVals, v);
                            $scope.pqInfo = v;
                        }, 300);

                    });
            })
            .error(function(rejection) {
                var msg = rejection ? rejection.UserMessage : "Generic server error";
                noty({
                    text: msg,
                    type: 'error',
                    timeout: 100,
                    killer: true
                });
            });

        $scope.execute = function() {
            $scope.gridOptions.dataSource.read();
            $log.info("Requery");
        }
    }

]);
