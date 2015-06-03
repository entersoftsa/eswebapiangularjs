(function() {
    'use strict';
    var esWEBUI = angular.module('es.Web.UI', []);

    function prepareStdZoom(zoomID, esWebApiService) {
        var xParam = {
            transport: {
                read: function(options) {

                    console.info("*** SERVER EXECUTION *** ", JSON.stringify(options));

                    var pqOptions = {};
                    esWebApiService.fetchStdZoom(zoomID, pqOptions)
                        .success(function(pq) {
                            // SME CHANGE THIS ONCE WE HAVE CORRECT PQ
                            if (pq.Count == -1) {
                                pq.Count = pq.Rows ? pq.Rows.length : 0;
                            }
                            // END tackling

                            options.success(pq);
                            console.info("Executed");
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
        return new kendo.data.DataSource(xParam);
    }

    esWEBUI.filter('esTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ]);

    esWEBUI
        .filter('esParamTypeMapper', function() {
            var f = function(pParam) {
                if (!pParam) {
                    return "";
                }

                if (pParam.InvSelectedMasterTable) {
                    if (pParam.InvSelectedMasterTable[4] == "Z") {
                        if (pParam.MultiValued == "true") {
                            return "esParamMultiZoom";
                        } else {
                            return "esParamZoom";
                        }
                    } else {
                        return "esParamText";
                    }
                } else {
                    return "esParamText";
                }
            };
            return f;
        })
        .directive('esParam', ['es.Services.WebApi', function(esWebApiService) {
            return {
                restrict: 'AE',
                scope: {
                    esParamDef: "=",
                    esParamVal: "=",
                    esType: "="
                },
                template: '<div ng-include src="\'../../src/partials/\'+esType+\'.html\'"></div>',
                link: function(scope, iElement, iAttrs) {
                    if (!scope.esParamDef) {
                        throw "You must set a param";
                    }

                    if (scope.esParamDef.InvSelectedMasterTable) {
                        scope.myDS = prepareStdZoom(scope.esParamDef.InvSelectedMasterTable, esWebApiService);
                    }
                }
            };
        }])
        .directive('esParamsPanel', function() {
            return {
                restrict: 'AE',
                scope: {
                    esParamsDef: '=',
                    esParamsValues: '='
                },
                templateUrl: function(element, attrs) {
                    console.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                    return "../../src/partials/esParams.html";
                }
            };
        });

    esWEBUI.factory("es.UI.Web.GridHelper", ['es.Services.WebApi', '$log',
        function(esWebApiService, $log) {

            function esColToKCol(esGridInfo, esCol) {
                var tCol = {
                    field: esCol.field,
                    title: esCol.title,
                    width: esCol.width,
                    attributes: esCol.attributes,
                    values: esCol.enumValues,

                }

                if (esCol.formatString && esCol.formatString != "") {
                    tCol.format = "{0:" + esCol.formatString + "}";
                }
                return tCol;
            }

            function esGridInfoToKInfo(esGridInfo) {
                if (!esGridInfo || !esGridInfo.columns) {
                    return null;
                }

                var z = _.sortBy(_.where(esGridInfo.columns, {
                    visible: true
                }), function(x) {
                    return parseInt(x.AA);
                });
                var z2 = _.map(z, function(x) {
                    return jColToTCol(esGridInfo, x);
                });
                return z2;
            }

            function winColToESCol(gridexInfo, jCol) {
                var esCol = {
                    AA: undefined,
                    field: undefined,
                    title: undefined,
                    width: undefined,
                    visible: undefined,
                    attributes: undefined,
                    enumValues: undefined,
                    formatString: undefined,
                };

                esCol.AA = parseInt(jCol.AA);
                esCol.field = jCol.ColName;
                esCol.title = jCol.Caption;
                esCol.formatString = jCol.FormatString;
                esCol.visible = (jCol.Visible == "true");
                
                if (jCol.TextAlignment == "3") {
                    esCol.attributes = {
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
                        esCol.enumValues = l2;
                    }
                }
                return esCol;
            }

            function winGridInfoToESGridInfo(gridexInfo) {
                if (!gridexInfo || !gridexInfo.LayoutColumn) {
                    return null;
                }

                var esGridInfo = {
                    id: undefined,
                    caption: undefined,
                    rootTable: undefined,
                    selectedMasterTable: undefined,
                    selectedMasterField: undefined,
                    totalRow: undefined,
                    columnHeaders: undefined,
                    columnSetHeaders: undefined,
                    columnSetRowCount: undefined,
                    columnSetHeaderLines: undefined,
                    headerLines: undefined,
                    groupByBoxVisible: undefined,
                    filterLineVisible: false,
                    previewRow: undefined,
                    previewRowMember: undefined,
                    previewRowLines: undefined,
                    columns: undefined,
                };

                var z2 = _.map(gridexInfo.LayoutColumn, function(x) {
                    return winColToESCol(gridexInfo, x);
                });


                esGridInfo.id = gridexInfo.ID;
                esGridInfo.caption = gridexInfo.Caption;
                esGridInfo.rootTable = gridexInfo.RootTable;
                esGridInfo.selectedMasterTable = gridexInfo.SelectedMasterTable;
                esGridInfo.selectedMasterField = gridexInfo.SelectedMasterField;
                esGridInfo.totalRow = gridexInfo.TotalRow;
                esGridInfo.columnHeaders = gridexInfo.ColumnHeaders;
                esGridInfo.columnSetHeaders = gridexInfo.ColumnSetHeaders;
                esGridInfo.columnSetRowCount = gridexInfo.ColumnSetRowCount;
                esGridInfo.columnSetHeaderLines = gridexInfo.ColumnSetHeaderLines;
                esGridInfo.headerLines = gridexInfo.HeaderLines;
                esGridInfo.groupByBoxVisible = gridexInfo.GroupByBoxVisible;
                esGridInfo.filterLineVisible = gridexInfo.FilterLineVisible;
                esGridInfo.previewRow = gridexInfo.PreviewRow;
                esGridInfo.previewRowMember = gridexInfo.PreviewRowMember;
                esGridInfo.previewRowLines = gridexInfo.PreviewRowLines;

                esGridInfo.columns = z2;
                return esGridInfo;
            }

            return ({
                winGridInfoToESGridInfo: winGridInfoToESGridInfo,
                winColToESCol: winColToESCol,
                esColToKCol: esColToKCol,
                esGridInfoToKInfo: esGridInfoToKInfo,
            });
        }
    ]);

})();
