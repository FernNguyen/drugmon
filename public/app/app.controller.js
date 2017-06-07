angular.module('myApp').controller('AppCtrl', function($scope,$http) {
  $scope.list_mesages = [];
  $scope.msg = {};

$scope.get_messages = function(){
  $http.post('/messages/list', {}).then(function(rs){

      var _tmp_obj = groupArrBy(rs.data.docs,'from');

      for (var o in _tmp_obj){
          $scope.list_mesages.push({
              from: o,
              messages:_tmp_obj[o]
          });
      }
      console.log($scope.list_mesages);
  }, function(){
      console.log('Error!');
  })
}

    $scope.detail_messages = $scope.list_mesages[0];
    $scope.set_active_index = function(pindex){
        $scope.detail_messages = $scope.list_mesages[pindex];
        $scope.detail_messages.index = pindex;
        console.log($scope.detail_messages);
    }

$scope.get_messages();

$scope.sendMsg = function(msg){

    var _xdata = {
        "id": "3E105262-070C-4913-949B-E7ACA4F42B71",
        "to": msg.to,
        "content": msg.content
        }
    $http.post('/send_message', _xdata).then(function(rs){
        if(rs.data.status === true) alert('Sent!')
    })

}

    var groupArrBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

});