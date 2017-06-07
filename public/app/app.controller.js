angular.module('myApp').controller('AppCtrl', function($scope,$http) {
  $scope.list_mesages = {};  
  $scope.msg = {};

$scope.get_messages = function(){
  $http.get('/messages').then(function(rs){
      $scope.list_mesages = rs.data;
  }, function(){
      console.log('Error!');
  })
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

});