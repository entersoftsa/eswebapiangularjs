'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore', 'es.Web.UI']);


function jColToTCol(gridexInfo, jCol) {
    var tCol = {
        field: jCol.ColName,
        title: jCol.Caption,
        //width: parseInt(jCol.Width)
    };

    if (jCol.TextAlignment == "3") {
        tCol.attributes = {
            style: "text-align: right;"
        };
    }

    //Enum Column
    if (jCol.EditType == "5") {
        var l1 = _.sortBy(_.where(gridexInfo.ValueList, {
            ColName: jCol.ColName
        }), function(x) {
            return parseInt(x.Value);
        });
        var l2 = _.map(l1, function(x) {
            return {
                text: x.Caption,
                value: parseInt(x.Value)
            };
        });
        if (l2 && l2.length) {
            tCol.values = l2;
        }
    }

    if (jCol.FormatString && jCol.FormatString != "") {
        tCol.format = "{0:" + jCol.FormatString + "}";
    }
    return tCol;
}

function convertJanusToTelerik(gridexInfo) {
    if (!gridexInfo || !gridexInfo.LayoutColumn) {
        return null;
    }

    var z = _.sortBy(_.where(gridexInfo.LayoutColumn, {
        Visible: "true"
    }), function(x) {
        return parseInt(x.AA);
    });
    var z2 = _.map(z, function(x) {
        return jColToTCol(gridexInfo, x);
    });
    return z2;
}

function prepareWebScroller(dsType, esWebApiService, $log, espqParams, esOptions) {
    var xParam = {
        transport: {
            read: function(options) {

                $log.info("*** SERVER EXECUTION *** ", JSON.stringify(options));

                var qParams = angular.isFunction(espqParams) ? espqParams() : espqParams;
                $log.info("*** SERVER PARAMS *** ", JSON.stringify(qParams));

                var pqOptions = {
                    WithCount: true
                };

                if (options.data && options.data.page && options.data.pageSize) {
                    pqOptions.Page = options.data.page;
                    pqOptions.PageSize = options.data.pageSize
                }

                esWebApiService.fetchPublicQuery(qParams.GroupID, qParams.FilterID, pqOptions, qParams.Params)
                    .success(function(pq) {
                        // SME CHANGE THIS ONCE WE HAVE CORRECT PQ

                        if (options.data && options.data.filter && options.data.filter.filters && options.data.filter.filters.length) {
                            $log.info("ES Filtering on ", options.data.filter.filters[0].value);

                            var vVal = options.data.filter.filters[0].value;
                            pq.Rows = _.filter(pq.Rows, function(gItem) {
                                return gItem.Code.indexOf(vVal) > -1;
                            }) || [];
                        }

                        if (!angular.isDefined(pq.Rows))
                        {
                            pq.Rows = [];
                            pq.Count = 0;
                        }

                        if (pq.Count == -1) {
                            pq.Count = pq.Rows ? pq.Rows.length : 0;
                        }
                        
                        // END tackling

                        options.success(pq);
                        $log.info("Executed");
                    })
                    .error(function(err) {
                        options.error(err);
                    });
            },

        },
        requestStart: function(e) {
            console.log("request started ", e);
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

                    grdopt.dataSource = prepareWebScroller(null, esWebApiService, $log, function() {
                        return {
                            GroupID: $scope.GroupID,
                            FilterID: $scope.FilterID,
                            Params: $scope.pVals
                        }
                    }, kdsoptions);

                    grdopt.excelExport = function(e) {
                        e.workbook.fileName += "sme-";
                    };

                    // hook test
                    //grdopt.dataSource.aggregate = [{field: "NumericField1", aggregate: "count"}];
                    // end test

                    grdopt.columns = convertJanusToTelerik(ret);
                    $scope.gridOptions = grdopt;
                    if (reBuild) {
                        $scope.xCount += 1;
                        $log.info("Rebuilding ", $scope.xCount);
                    }


                    $log.info('OK! ');

                });
        }
    }

]);