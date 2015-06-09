'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);




smeControllers.controller('esPQCtrl', ['$timeout', '$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.GridHelper', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($timeout, $scope, $log, esWebApiService, esWebGridHelper, _, cache, esMessaging) {

        $scope.currentUser = {};

        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESFICustomer";
        $scope.FilterID = "hka_customerlist";
        $scope.gridOptions = null;
        $scope.pVals = { };
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
                            var v = esWebGridHelper.winGridInfoToESGridInfo($scope.GroupID, $scope.FilterID, ret);
                            angular.extend($scope.pVals, v.defaultValues);
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
            pVals["Inactive"] = 1;
            debugger;
            return;
            esWebApiService.fetchPublicQueryInfo($scope.GroupID, $scope.FilterID)
                .success(function(ret) {
                    var grdopt = {
                        pageable: true,
                        sortable: true,
                        filterable: true,
                        resizable: true,
                        toolbar: ["excel"],
                        excel: {
                            allPages: true,
                            fileName: $scope.GroupID + "-" + $scope.FilterID + ".xlsx",
                            filterable: true
                        }
                    };

                    var kdsoptions = {
                        serverFiltering: true,
                        serverPaging: true,
                        pageSize: 20
                    };

                    grdopt.dataSource = esWebGridHelper.getPQDataSource(null, esWebApiService, $log, function() {
                        return {
                            GroupID: $scope.GroupID,
                            FilterID: $scope.FilterID,
                            Params: $scope.pVals
                        }
                    }, kdsoptions);

                    grdopt.columns = esWebGridHelper.esGridInfoToKInfo(esWebGridHelper.winGridInfoToESGridInfo(ret));
                    $scope.gridOptions = grdopt;
                    $log.info('OK! ');
                });
        }
    }

]);