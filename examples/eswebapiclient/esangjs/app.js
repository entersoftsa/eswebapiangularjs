angular.module('esAngApp', [])
    .controller('esAngCtrl', ['$scope', function($scope) {
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };

        $scope.data = {
        	name: 'Stavros',
        	address: "A. Theohari 62 Street"
        };
    }])
    .directive('myCustomer', function() {
        return {
            restrict: 'AE',
            scope: {
            	esParamItem: "=esParamItem"
            },
            templateUrl: function(element, attrs) {
            	console.info("Parameter element = ", element, " Parameter attrs = ", attrs);
                return "mycustomer.html";
            }
        };
    });