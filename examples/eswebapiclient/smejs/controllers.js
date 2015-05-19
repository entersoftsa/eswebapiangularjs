'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore']);

function calcCols(cols, data) {

    if ((cols && cols.length > 0) || !data) {
        return cols;
    }

    var NumCols = Math.floor((Math.random() * 10) + 1); 

    var kendoCols = [];
    var dtCols = Object.keys(data[0]);
    var mx = Math.min(NumCols, dtCols.length);
    var index;

    for (index = 0; index < mx; index++) {
        kendoCols.push({
            field: dtCols[index],
            title: dtCols[index]
        });
    }
    return kendoCols;
}

function prepareWebScroller(esWebApiService, $log, GroupID, FilterID, params, esOptions) {
    var ds = new kendo.data.DataSource({
        transport: {
            read: function(options) {
                esWebApiService.fetchPublicQuery(GroupID, FilterID, {})
                    .success(function(pq) {
                        // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                        pq.Count = 27;
                        pq.Rows = pq.Rows.slice(options.data.skip, options.data.skip + options.data.pageSize);
                        // END tackling

                        options.success(pq);
                        $log.info("Executed");
                    });
            }
        },
        schema: {
            data: "Rows",
            total: "Count"
        },
        serverPaging: true,
        pageSize: 5
    });

    return ds;
}

smeControllers.controller('smeCtrl', ['$scope', '$log', 'es.Services.WebApi', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($scope, $log, esWebApiService, _, cache, esMessaging) {

        $scope.currentUser = {};
        $scope.xCount = 0;

        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESTMTask";
        $scope.FilterID = "RequestsToBeApproved";
        $scope.gridOptions = null;

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


        $scope.planB = function(reBuild) {

            if (!reBuild) {
                if (!$scope.gridOptions || !$scope.gridOptions.dataSource) {
                    reBuild = true;
                }
                else {
                    $scope.gridOptions.dataSource.read();
                    $log.info("Requery");
                    return;
                }
            }

            var grdopt = {
                pageable: true,
                sortable: true
            };

            esWebApiService.fetchPublicQuery($scope.GroupID, $scope.FilterID, {})
                .success(function(pq) {
                    grdopt.columns = calcCols(grdopt.columns, pq.Rows);
                    grdopt.dataSource = prepareWebScroller(esWebApiService, $log, $scope.GroupID, $scope.FilterID);

                    $scope.gridOptions = grdopt;
                    if (reBuild) {
                        $scope.xCount += 1;
                        $log.info("Rebuilding ", $scope.xCount);
                    }
                });

            $log.info('OK! ');
        }
    }
]);
