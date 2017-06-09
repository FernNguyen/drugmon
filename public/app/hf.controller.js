angular.module('myApp').controller('HFCtrl', function($scope,$http) {
  $scope.list_hf = [];
  $scope.msg = {};
  $scope.list_drug = [];
  $scope.hf_drugs = [];
  $scope.newdrug = {};
$scope.get_hfdetail = function(){
  $http.post('/healthfacility/list', {}).then(function(rs){
      $scope.list_hf = rs.data.docs;
  }, function(){
      console.log('Error!');
  })


    //Todo: Get drugs
    $http.post('/drugs/list', {}).then(function(rs){
        $scope.list_drug = [];
        $scope.list_drug = rs.data.docs;
    }, function(){
        console.log('Error!');
    })

}

$scope.get_hfdetail();

    $scope.hf_selected = undefined;
    $scope.choose_hf = function (hf) {
        $scope.hf_selected = hf;
        $scope.get_hfdrugs(hf._id);
    }



    //Todo: Find drug by HF ID
    $scope.get_hfdrugs = function(hf_id){
        var _xdata = {
            "params": {
                "$eq":{
                    "hf_id":hf_id
                }
            }
        }
        $http.post('/hfdrugs/list', _xdata).then(function(rs){
            $scope.hf_drugs = rs.data.docs;
        }, function(){
            $scope.hf_drugs = [];
        })
    }

$scope.createNewHF = function(hf){
    var _xdata = {
        "data": hf
    };
    $http.post('/healthfacility', _xdata).then(function(rs){
        alert('Success!');
        $scope.get_hfdetail();
    })
}

$scope.add_hfdrug = function(drug){
    var tmp_hfdrug = {
        data : {
            hf_name: $scope.hf_selected.hf_name,
            hf_id: $scope.hf_selected._id,
            drug_name: drug.drug_push.selected.drug_name,
            drug_code: drug.drug_push.selected.drug_code,
            drug_description: drug.drug_push.selected.drug_description,
            drug_id: drug.drug_push.selected._id,
            drug_asl: parseInt(drug.drug_asl),
            drug_eop: parseInt(drug.drug_eop),
            drug_abs: parseInt(drug.drug_abs),
            hf_detail: $scope.hf_selected
        }
    }
    $http.post('/hfdrugs', tmp_hfdrug).then(function(rs){
        $scope.newdrug = {};
        $scope.hf_drugs.push(tmp_hfdrug.data);
    })
}


});