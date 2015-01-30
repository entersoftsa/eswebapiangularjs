(function() {
    'use strict';

    var esFilters = angular.module('es.Core.Filters', []);

    esFilters.filter('esTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }
    ]);
})();
