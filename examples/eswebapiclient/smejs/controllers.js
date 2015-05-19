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
    var xParam = {
        transport: {
            read: function(options) {
                if (options.data.filter) {
                    $log.info  ("Filtered data ", JSON.stringify(options.data.filter));
                }
                esWebApiService.fetchPublicQuery(GroupID, FilterID, params)
                    .success(function(pq) {
                        // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                        if (Object.keys(options.data).length) {
                            $log.info  ("Page ", options.data.page, " PageSize ", options.data.pageSize, " Skip ", options.data.skip, " Take ", options.data.take);
                            pq.Count = 136;
                            pq.Rows = pq.Rows.slice(options.data.skip, options.data.skip + options.data.pageSize);
                        }

                        // END tackling

                        options.success(pq);
                        $log.info("Executed");
                    });
            }
        },
        schema: {
            data: "Rows",
            total: "Count"
        }
    };

    if (esOptions) {
        angular.extend(xParam, esOptions);
    }

    var ds = new kendo.data.DataSource(xParam);
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

        var kdsoptions = {
            serverFiltering: true,
            serverPaging: true,
            pageSize: 15
        };

        $scope.comboOptions = {
            template: '<span class="order-id">#= Code #</span>-- #= RequestDate #, #= RequestNature #',
            placeholder: "Select a Task",
            autoBind: false,
            filter: "contains",
            minLength: 3,
            dataTextField: "Code",
            dataValueField: "GID",
            virtual: {
                itemHeight: 26
            },
            dataSource: prepareWebScroller(esWebApiService, $log, $scope.GroupID, $scope.FilterID, {}, kdsoptions),
            height: 220
        };


        $scope.planB = function(reBuild) {

            if (!reBuild) {
                if (!$scope.gridOptions || !$scope.gridOptions.dataSource) {
                    reBuild = true;
                } else {
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

                    var kdsoptions = {
                        serverPaging: true,
                        pageSize: 10,
                        serverFiltering: false
                    };
                    grdopt.dataSource = prepareWebScroller(esWebApiService, $log, $scope.GroupID, $scope.FilterID, {}, kdsoptions);

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
