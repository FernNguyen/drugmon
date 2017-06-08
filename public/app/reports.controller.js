angular.module('myApp').controller('ReportCtrl', function($scope,$http) {
    $scope.list_register = [];
    $scope.msg = {};

    $scope.get_messages = function(){
        $http.post('/drugregisters/list', {}).then(function(rs){
            $scope.list_register = rs.data.docs;
        }, function(){
            console.log('Error!');
        })
    }

    $scope.detail_messages = undefined;

    $scope.choose_report = function(report,index){
        $scope.detail_messages = report;
        $scope.detail_messages.index = index;
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