/**
 * Created by Linhnv on 12-Jun-17.
 */

angular.module('drugmonApp').controller('AccountCtrl', function($scope,$rootScope,$http,$location,toaster,$cookies,$state) {


    $scope.login = {};
    $rootScope.login_state =$location.url();

    $scope.loginAction = function(){
        var login_detail = {
            username: $scope.login.username,
            password: $scope.login.password
        }
        $http.post('/login', login_detail).then(function(rs){
            if(rs.data.status == true){
                toaster.clear();
                toaster.pop('success', "Success", rs.data.message, 5000);
                var currentUser = {
                    username:rs.data.user_info.username,
                    is_admin:rs.data.user_info.is_admin,
                    token:rs.data.token
                };

                $cookies.putObject('currentUser',currentUser);
                $rootScope.user_logged = currentUser;

                if(currentUser.is_admin){
                    $state.go('app');
                }else{
                    $state.go('userregister');
                }

            }else{
                toaster.clear();
                toaster.pop('error', "Error", rs.data.message, 5000);

            }

        })
    }


})
