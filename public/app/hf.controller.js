angular.module('myApp').controller('HFCtrl', function($scope,$http) {
  $scope.list_hf = [];
  $scope.msg = {};

$scope.get_hfdetail = function(){
  $http.post('/healthfacility/list', {}).then(function(rs){
      $scope.list_hf = rs.data.docs;
  }, function(){
      console.log('Error!');
  })
}

$scope.get_hfdetail();

    $scope.hf_selected = undefined;
    $scope.choose_hf = function (hf) {
        $scope.hf_selected = hf;
    }

$scope.createNewHF = function(hf){
    var _xdata = {
        "data": hf
    };
    $http.post('/healthfacility', _xdata).then(function(rs){
        console.log(rs.data);
        $scope.get_hfdetail();
    })
}

});