'use strict';

/* Controllers */

var smeControllers = angular.module('smeControllers', ['kendo.directives', 'underscore']);


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

function prepareStdZoom(zoomID, esWebApiService, $log, esOptions) {
    var xParam = {
        //batch: true,
        transport: {

            destroy: function(options) {
                $log.info("Destroy ", options);
            },
            create: function(options, h4) {
                $log.info("Create ", options);
                //options.success(options.data);
            },
            
            parameterMap: function(options, operation) {
                $log.info("Map ", options, " - ", operation);
            },

            update: function(options) {
                $log.info("Update ", options);
            },
            
            read: function(options) {

                $log.info("*** SERVER EXECUTION *** ", JSON.stringify(options));

                var pqOptions = {};

                if (options.data && options.data.page && options.data.pageSize) {
                    pqOptions.WithCount = true;
                    pqOptions.Page = options.data.page;
                    pqOptions.PageSize = options.data.pageSize
                }

                esWebApiService.fetchStdZoom(zoomID, pqOptions)
                    .success(function(pq) {
                        // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                        if (pq.Count == -1) {
                            pq.Count = pq.Rows ? pq.Rows.length : 0;
                        }
                        // END tackling

                        pq.Rows = _.map(pq.Rows, function(f) {
                            return {
                                Code: f.Code,
                                Description: f.Description,
                                AlternativeDescription: f.AlternativeDescription
                            };
                        });

                        options.success(pq);
                        $log.info("Executed");
                    })
                    .error(function(err) {
                        options.error(err);
                    });
            }

        },
        schema: {
            model: {
                id: "Code",
                fields: {
                    Code: {
                        editable: false,
                        nullable: true
                    },
                    Description: {
                        validation: {
                            required: true
                        }
                    },
                    AlternativeDescription: {
                        type: "string",
                        validation: {
                            required: false
                        }
                    }
                }
            },

            data: "Rows",
            total: "Count"
        }
    }

    if (esOptions) {
        angular.extend(xParam, esOptions);
    }

    return new kendo.data.DataSource(xParam);
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

                        if (pq.Count == -1) {
                            pq.Count = pq.Rows ? pq.Rows.length : 0;
                        }

                        // pq.Rows = _.sortBy(pq.Rows, 'Code');

                        // END tackling

                        options.success(pq);
                        $log.info("Executed");
                    })
                    .error(function(err) {
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

smeControllers.controller('esStdZoomCtrl', ['$scope', '$log', 'es.Services.WebApi', '_', 'es.Services.Cache', 'es.Services.Messaging',
    function($scope, $log, esWebApiService, _, cache, esMessaging) {

        $scope.currentUser = {};

        $scope.credentials = {
            UserID: 'sme',
            Password: '1234',
            BranchID: 'ΑΘΗ',
            LangID: 'el-GR'
        };

        $scope.ZoomID = "ESGOZCurrency";
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

                // test
                /*
                var pqOptions = {
                    WithCount: false,
                    Page: 4,
                    PageSize: 3
                };
                esWebApiService.fetchStdZoom($scope.ZoomID, pqOptions)
                    .success(function(pq) {
                        $log.info("Count ", pq.Count, "Page ", pq.Page, "PageSize ", pq.PageSize, "Table ", pq.Table, "Rows ", pq.Rows.length);
                    })
                    .error(function(err) {
                        $log.error(err);
                    });

                // end test
                */
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


        $scope.save = function() {
            $scope.myGrid.dataSource.sync();
        }

        $scope.planB = function(reBuild) {
            if (!reBuild) {
                if (!$scope.gridOptions) {
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
                resizable: true,
                editable: true,
                toolbar: ["create", "save", "cancel"],
            };

            var kdsoptions = {
                //serverPaging: false,
                //pageSize: 5
            };

            grdopt.dataSource = prepareStdZoom($scope.ZoomID, esWebApiService, $log, kdsoptions);

            $scope.gridOptions = grdopt;
            if (reBuild) {
                $scope.xCount += 1;
                $log.info("Rebuilding ", $scope.xCount);
            }


            $log.info('OK! ');
        }
    }

]);
