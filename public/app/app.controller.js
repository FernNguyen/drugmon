angular.module('drugmonApp').controller('AppCtrl', function($scope,$http,$filter) {

    $scope.monthly_reporting_ratio = {};
    $scope.total_number = {};
    $scope.data_reports = [];
    $scope.sort_by_month = {};
    $scope.drugs = [];
    $scope.drug_selected = {};
    $scope.get_drug_list = function () {
        $http.post('/drugs/list', {}).then(function(rs){
            $scope.drugs = [];
            $scope.drugs = rs.data.docs;

            if($scope.drugs.length >= 1){
                $scope.monthly_rp_by_drug($scope.drugs[0].drug_code);
                $scope.drug_selected = $scope.drugs[0];
            }

        }, function(){
            console.log('Error!');
        })
    }

    $scope.get_data_reports = function(){
    //Get data register
    $http.post('/drug_histories/list', {}).then(function(rs){
        $scope.data_reports = rs.data.docs;
        $scope.data_reports.forEach(function(e_drug){
            var _xdate = new Date(e_drug.createdAt);
            var _month = _xdate.getMonth()+1;
            var _year = _xdate.getFullYear();

            if(!$scope.sort_by_month[_year]){
                $scope.sort_by_month[_year] = {};
            }
            if(!$scope.sort_by_month[_year][_month]){
                $scope.sort_by_month[_year][_month] = {}
            }
            if(!$scope.sort_by_month[_year][_month][e_drug.hf_id]){
                $scope.sort_by_month[_year][_month][e_drug.hf_id] = {
                    data: []
                }
            }
            $scope.sort_by_month[_year][_month][e_drug.hf_id].data.push(e_drug);
        })

        get_data_chart($scope.sort_by_month);
    }, function(){
        console.log('Error!');
    })
    }


    $scope.monthly_rp_by_drug = function(drug_code){
        var by_drugs = {};
        $scope.by_drugs_reports = [];
        var _current_date = new Date();
        var _current_month = _current_date.getMonth()+1;
        var _last_month = _current_month-1;
        var _current_year = _current_date.getFullYear();
        var _compare_month = [_last_month,_current_month];
                //Loop Month
        _compare_month.forEach(function(e_month){

            for (var hf_idx in $scope.sort_by_month[_current_year][e_month]) {
                var each_hf = $scope.sort_by_month[_current_year][e_month][hf_idx];
                each_hf.data.forEach(function(each_drug){
                    if(each_drug.drug_code == drug_code){
                        if(!by_drugs[e_month]){
                            by_drugs[e_month]= {
                                name:str_pad(e_month)+"/"+_current_year,
                                data : []
                            }
                        }
                        by_drugs[e_month].data.push({
                            hf_name: each_drug.hf_detail.name,
                            drug_code: each_drug.drug_code,
                            drug_abs: each_drug.drug_abs,
                            drug_asl: each_drug.drug_asl,
                            drug_eop: each_drug.drug_eop,
                            is_eop : (each_drug.drug_abs <= each_drug.drug_eop ? true : false),
                            is_asl : (each_drug.drug_abs > each_drug.drug_asl ? true : false)
                        })
                    }
                })

                var _total_eop = by_drugs[e_month].data.filter(function(rs){ return rs.is_eop});
                var _total_asl = by_drugs[e_month].data.filter(function(rs){ return rs.is_asl});
                var _total_eop_month =  by_drugs[e_month].data.reduce(function (sum,value) {
                        return sum+value.drug_abs;
                },0)
                by_drugs[e_month].percent_eop = (_total_eop.length/by_drugs[e_month].data.length)*100;
                by_drugs[e_month].percent_asl = (_total_asl.length/by_drugs[e_month].data.length)*100;
                by_drugs[e_month].total_eop_month = _total_eop_month;
            }



        })

        //
        // for(var ifih in by_drugs){
        //     var tm_data = by_drugs[ifih];
        //     tm_data.status_eop = (by_drugs[_current_month].percent_eop>by_drugs[_last_month].percent_eop ? 'up' : (by_drugs[_current_month].percent_eop<by_drugs[_last_month].percent_eop ? 'down' : '-'));
        //     tm_data.status_asl = (by_drugs[_current_month].percent_asl>by_drugs[_last_month].percent_asl ? 'up' : (by_drugs[_current_month].percent_asl<by_drugs[_last_month].percent_asl ? 'down' : '-'));
        //
        //     $scope.by_drugs_reports.push(tm_data);
        // }

        $scope.by_drugs_reports = [
            {
                "month": str_pad(_last_month)+"/"+_current_year,
                "name": "EOP",
                "percent_lastmonth": by_drugs[_last_month].percent_eop.toFixed(2),
                "percent_current": by_drugs[_current_month].percent_eop.toFixed(2),
                "status": (by_drugs[_current_month].percent_eop>by_drugs[_last_month].percent_eop ? 'up' : (by_drugs[_current_month].percent_eop<by_drugs[_last_month].percent_eop ? 'down' : '-'))
            },
            {
                "month": str_pad(_current_month)+"/"+_current_year,
                "name": "ASL",
                "percent_lastmonth": by_drugs[_last_month].percent_asl.toFixed(2),
                "total_eop_month": by_drugs[_last_month].total_eop_month,
                "percent_current": by_drugs[_current_month].percent_asl.toFixed(2),
                "status": (by_drugs[_current_month].percent_asl>by_drugs[_last_month].percent_asl ? 'up' : (by_drugs[_current_month].percent_asl<by_drugs[_last_month].percent_asl ? 'down' : '-'))

            }
        ];

        console.log($scope.by_drugs_reports);

    }

    $scope.get_data_reports();
    $scope.get_drug_list();


    function str_pad(n) {
        return String("00" + n).slice(-2);
    }


    $scope.data_col_chart = [];
    function get_data_chart(obj){
        //$scope.data_col_chart = [];
        for(var index in obj) {
            //Loop Year
            for(var month_idx in obj[index]){
                console.log(month_idx);
                //Loop Month
                var _tmp_obj =
                    {c: [
                        {v: str_pad(month_idx) + '/' + index},
                        {v: Object.keys(obj[index][month_idx]).length}
                    ]}
                $scope.data_col_chart.push(_tmp_obj);}
        }
        console.log($scope.data_col_chart);
    }

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
    ], "rows": $scope.data_col_chart};

    $scope.monthly_reporting_ratio.options = {
        'title': '',
        'isStacked':'normal',
        "displayExactValues": true,
    };


});