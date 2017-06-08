angular.module('myApp').controller('DrugsCtrl', function($scope,$http) {
  $scope.list_drug = [];
  $scope.msg = {};
  $scope.drug = {};
  $scope.list_drug_categories = [];
  $scope.newdrug = {};
  $scope.drug_category_name = '';

$scope.get_drugdetail = function(){
    //Todo: Get category
  $http.post('/drugcat/list', {}).then(function(rs){
      $scope.list_drug_categories = [];
      $scope.list_drug_categories = rs.data.docs;
  }, function(){
      console.log('Error!');
  });

  //Todo: Get drugs
  $http.post('/drugs/list', {}).then(function(rs){
      $scope.list_drug = [];
      $scope.list_drug = rs.data.docs;
  }, function(){
      console.log('Error!');
  })
}

$scope.add_drugcat = function(drug_category_name){
    $http.post('/drugcat', {
        data: {
            cat_name: drug_category_name
        }
    }).then(function(rs){
        $scope.get_drugdetail();//Success or not!!!
        $scope.drug_category_name = '';
    })
}

$scope.get_drugdetail();


    $scope.hf_selected = undefined;
    $scope.choose_hf = function (hf) {
        $scope.hf_selected = hf;
    }

$scope.createNewHF = function(hf){
    var _xdata = {
        "data": hf
    };
    $http.post('/healthfacility', _xdata).then(function(rs){
        $scope.get_hfdetail();
    })
}


$scope.createNewDrug = function(drug){
    var tmp_drug = {
        "drug_name": drug.drug_name,
        "drug_code": drug.drug_code,
        "drug_category_id": (drug.drug_category.selected && drug.drug_category.selected._id ? drug.drug_category.selected._id : ''),
        "drug_category_name": (drug.drug_category.selected && drug.drug_category.selected.cat_name ? drug.drug_category.selected.cat_name : ''),
        "drug_description": drug.drug_description,
        "drug_status": (drug.drug_status == 1 ? true : false)
    }
    var _xdata = {
        "data": tmp_drug
    }
    $http.post('/drugs', _xdata).then(function(rs){
        console.log(rs.data);
    })
}

$scope.deleteDrug = function(objID){
    var del_data = {
        data: {"hardDelete": false}
        }

        console.log(del_data);

    $http.delete('/drugs/'+objID, del_data).then(function(rs){
        console.log(rs.data);
        $scope.get_drugdetail();
    })
}


});