'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);




smeControllers.controller('esPQCtrl', ['$scope', '$log', 'es.Services.WebApi', 'es.UI.Web.UIHelper',  '_', 'es.Services.Cache', 'es.Services.Messaging', 'es.Services.Globals',
    function($scope, $log, esWebApiService, esWebUIHelper, _, cache, esMessaging, esGlobals) {

        $scope.currentUser = {};
        $scope.version = {
            esAngularVersion: esGlobals.getVersion();
            esWebAPIVersion: esWebApiService.fetchServerCapabilities()
        };

        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESFICustomer";
        $scope.FilterID = "CustomerList";
        //$scope.FilterID = "RequestsToBeApproved";
        $scope.gridOptions = null;
        $scope.xCount = 0;
        $scope.pqInfo = null;
        $scope.pVals = {};

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


        $scope.getPQInfo = function() {
            esWebApiService.fetchPublicQueryInfo($scope.GroupID, $scope.FilterID)
                .success(function(ret) {
                    $scope.pqInfo = ret;
                });
        }


        $scope.planB = function(reBuild) {
            if (!reBuild) {
                if (!$scope.gridOptions || !$scope.gridOptions.columns) {
                    reBuild = true;
                } else {
                    $scope.gridOptions.dataSource.read();
                    $log.info("Requery");
                    return;
                }
            }

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

                    grdopt.dataSource = esWebUIHelper.getPQDataSource(null, esWebApiService, $log, function() {
                        return {
                            GroupID: $scope.GroupID,
                            FilterID: $scope.FilterID,
                            Params: $scope.pVals
                        }
                    }, kdsoptions);

                    grdopt.columns = esWebUIHelper.esGridInfoToKInfo(esWebUIHelper.winGridInfoToESGridInfo(ret));
                    $scope.esGridOptions = grdopt;
                });
        }
    }

]);