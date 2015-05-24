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

function prepareWebScroller(dsType, esWebApiService, $log, espqParams, esOptions) {
    var xParam = {
        transport: {
            read: function(options) {

                $log.info("*** SERVER EXECUTION *** ", JSON.stringify(options));

                var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;

                esWebApiService.fetchPublicQuery(qParams.GroupID, qParams.FilterID, qParams.Params)
                    .success(function(pq) {
                        // SME CHANGE THIS ONCE WE HAVE CORRECT PQ

                        if (options.data && options.data.filter && options.data.filter.filters && options.data.filter.filters.length) {
                            $log.info("ES Filtering on ", options.data.filter.filters[0].value);

                            var vVal = options.data.filter.filters[0].value;
                            pq.Rows = _.filter(pq.Rows, function(gItem) {
                                return gItem.Code.indexOf(vVal) > -1;
                            }) || [];
                        }

                        if (pq.Count == -1) {
                            pq.Count = pq.Rows ? pq.Rows.length : 0;
                        }

                        pq.Rows = _.sortBy(pq.Rows, 'Code');

                        if (options.data && options.data.pageSize) {
                            $log.info("Page ", options.data.page, " PageSize ", options.data.pageSize, " Skip ", options.data.skip, " Take ", options.data.take);
                            pq.Rows = pq.Rows.slice(options.data.skip, options.data.skip + options.data.pageSize);
                        }

                        // END tackling

                        for (var i = 0; i < pq.Rows.length; i++) {
                            $log.info(i, " ==> ", pq.Rows[i]["Code"]);
                        }
                        options.success(pq);
                        $log.info("Executed");
                    })
                    .error(function (err) 
                    {
                        options.error(err);
                    });
            }

        },
        schema: {
            data: "Rows",
            total: "Count"
        }
    }

    if (esOptions) {
        angular.extend(xParam, esOptions);
    }

    if (dsType && dsType === "pivot") {
        return new kendo.data.PivotDataSource(xParam);
    } else {
        return new kendo.data.DataSource(xParam);
    }
}

smeControllers.controller('esPQCtrl', ['$scope', '$log', 'es.Services.WebApi', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($scope, $log, esWebApiService, _, cache, esMessaging) {

        $scope.currentUser = {};

        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESTMTask";
        $scope.FilterID = "WebScrollerTest";
        //$scope.FilterID = "RequestsToBeApproved";
        $scope.gridOptions = null;
        $scope.xCount = 0;

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
                } else {
                    $scope.gridOptions.dataSource.read();
                    $log.info("Requery");
                    return;
                }
            }

            var grdopt = {
                pageable: true,
                sortable: true,
                filterable: true
            };

            var kdsoptions = {
                serverFiltering: true,
                serverPaging: true,
                pageSize: 50
            };

            grdopt.dataSource = prepareWebScroller(null, esWebApiService, $log, function() {
                return {
                    GroupID: $scope.GroupID,
                    FilterID: $scope.FilterID,
                    Params: {
                        Code: $scope.Code,
                        OppRevenue: $scope.OppRevenue
                    }
                }
            }, kdsoptions);

            $scope.gridOptions = grdopt;
            if (reBuild) {
                $scope.xCount += 1;
                $log.info("Rebuilding ", $scope.xCount);
            }


            $log.info('OK! ');
        }
    }

]);