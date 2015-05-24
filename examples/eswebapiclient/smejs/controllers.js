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

function prepareWebScroller(dsType, esWebApiService, $log, GroupID, FilterID, params, esOptions) {
    var xParam = {
        transport: {
            read: function(options) {

                $log.info("*** SERVER EXECUTION *** ", JSON.stringify(options));

                esWebApiService.fetchPublicQuery(GroupID, FilterID, params)
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

    if (dsType && dsType === "pivot") {
        return new kendo.data.PivotDataSource(xParam);
    } else {
        return new kendo.data.DataSource(xParam);
    }
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

        $scope.taskToSel = "2b995a10-a835-4148-b222-e4c67ec21b75";
        $scope.textToSel = "GenReq-00694";

        var kdsoptions = {
            serverFiltering: true,
            serverPaging: true,
            pageSize: 50
        };

        $scope.comboOptions = {
            template: '<span class="order-id">#= Code #</span>-- #= RequestDate #, #= RequestNature #',
            placeholder: "Select a Task",
            autoBind: false,
            filter: "contains",
            ignoreCase: false,
            minLength: 3,
            dataTextField: "Code",
            dataValueField: "GID",

            virtual: {
                itemHeight: 26,
                valueMapper: function(options) {
                    $log.info("options ", JSON.stringify(options));
                    //Execute the same scroller with equal param to locate a single record 
                    esWebApiService.fetchPublicQuery($scope.GroupID, $scope.FilterID, {})
                        .success(function(pq) {
                            // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                            if (pq.Count == -1) {
                                pq.Count = pq.Rows ? pq.Rows.length : 0;
                            }
                            // END tackling

                            var iRet = _.findWhere(pq.Rows, {
                                GID: options.value
                            });
                            if (iRet) {
                                pq.Rows = [iRet];
                                var ind = 62;
                                options.success([ind]);
                                $log.info("LOOKUP INDEX");
                                return;
                            } else {
                                options.success([]);
                            }

                        });
                }
            },

            dataSource: prepareWebScroller(null, esWebApiService, $log, $scope.GroupID, $scope.FilterID, {}, kdsoptions),
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
                //pageable: true,
                sortable: true,
                filterable: true,
                scrollable: {
                    virtual: true
                },
            };

            esWebApiService.fetchPublicQuery($scope.GroupID, $scope.FilterID, {})
                .success(function(pq) {
                    grdopt.columns = calcCols(grdopt.columns, pq.Rows);

                    var kdsoptions = {
                        serverPaging: true,
                        serverFiltering: false,
                        serverSorting: false,
                        pageSize: 10,

                    };
                    grdopt.dataSource = prepareWebScroller(null, esWebApiService, $log, $scope.GroupID, $scope.FilterID, {}, kdsoptions);

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


smeControllers.controller('cubeCtrl', ['$scope', '$log', 'es.Services.WebApi', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($scope, $log, esWebApiService, _, cache, esMessaging) {

        $scope.currentUser = {};
        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.GroupID = "ESTMTask";
        $scope.FilterID = "RequestsToBeApproved";

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

 
        $scope.planD = function() {

            var dsOptions = {
                schema: {
                    data: "Rows",
                    total: "Count",
                    cube: {
                        dimensions: {
                            RequestCategory: {
                                caption: "All Categories"
                            },
                            Priority: {
                                caption: "Priority"
                            }
                        },
                        measures: {
                            "Sum": {
                                field: "RequestAmount",
                                format: "{0:c}",
                                aggregate: "sum"
                            },
                            "Average": {
                                field: "RequestAmount",
                                format: "{0:c}",
                                aggregate: "average"
                            }
                        }
                    }
                },
                columns: [{
                    name: "RequestCategory",
                    expand: true
                }],
                rows: [{
                    name: "Priority",
                    expand: true
                }],
                measures: ["Sum"]
            };

            var ds = prepareWebScroller("pivot", esWebApiService, $log, $scope.GroupID, $scope.FilterID, {}, dsOptions);

            var grdopt = {
                columnWidth: 200,
                height: 580,
                dataSource: ds
            };

            $scope.cubeOptions = grdopt;
        }

    }
]);