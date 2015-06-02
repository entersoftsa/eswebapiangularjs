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
                        if (!pParam.MultiValued) {
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

})();