/**
 * Created by Linhnv on 12-Jun-17.
 */

angular.module('drugmonApp').controller('AccountCtrl', function($scope,$rootScope,$http,$location) {

    console.log($location.url());
    $rootScope.login_state =$location.url();
})
