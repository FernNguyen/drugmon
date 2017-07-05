angular.module('drugmonApp').controller('AppCtrl', function($scope,$http) {

    $scope.monthly_reporting_ratio = {};
    $scope.total_number = {};

    $scope.monthly_reporting_ratio.type = "ColumnChart";
    $scope.total_number.type = "PieChart";

    $scope.total_number.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": [
        {c: [
            {v: "Reporting Center"},
            {v: 3},
        ]},
        {c: [
            {v: "Health Post"},
            {v: 31}
        ]}
    ]};

    $scope.monthly_reporting_ratio.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Health Post", type: "number"}
    ], "rows": [
        {c: [
            {v: "09/2016"},
            {v: 18},
            {v: 18}
        ]},{c: [
            {v: "10/2016"},
            {v: 5},
        ]},{c: [
            {v: "11/2016"},
            {v: 22},
        ]},{c: [
            {v: "12/2016"},
            {v: 19},
        ]},{c: [
            {v: "01/2017"},
            {v: 26},
        ]},{c: [
            {v: "03/2017"},
            {v: 32},
        ]},{c: [
            {v: "03/2017"},
            {v: 32},
        ]},{c: [
            {v: "04/2017"},
            {v: 10},
        ]},
        {c: [
            {v: "05/2017"},
            {v: 17}
        ]},
        {c: [
            {v: "06/2017"},
            {v: 22},
        ]},
        {c: [
            {v: "07/2017"},
            {v: 10},
        ]}
    ]};

    $scope.monthly_reporting_ratio.options = {
        'title': '',
        'isStacked':'normal',
        "displayExactValues": true,
    };


});