/**
 * Created by Linhnv on 12-Jun-17.
 */

angular.module('drugmonApp').controller('homeCtrl', function($scope,$rootScope,$http,$stateParams,$location,$cookies,$state,ConfirmBox,ModalControl,toaster ) {

    $scope.toogle_xmenu = function(){
        $('#toggle_mobile_menu').click();
    }
        $rootScope.user_logged = ($cookies.get('currentUser') ? JSON.parse($cookies.get('currentUser')) : undefined );

    $scope.logoutAction = function(){
        ConfirmBox.confirm('Confirm', 'Are you sure you want to logout?').then(function() {
            $cookies.remove('currentUser');
            $rootScope.user_logged = undefined;
            $state.go('login');
        })
    }
});

angular.module('drugmonApp').controller('SettingCtrl', function($scope,$rootScope,$http,$stateParams,$location,ConfirmBox,ModalControl,toaster,sha1) {

    $scope.list_settings = [];
    $scope.list_accounts = [];
    $scope.list_hf = [];
    $scope.newacc = {};
    $scope.get_list_settings = function(filter){
        var x_filter = {};
        $http.post('/settings/list',x_filter).then(function(rs){
            if(rs.data.responseCode == 0){
                $scope.list_settings = rs.data.docs;
            }
        })
    }
    $scope.save_setting = function(setting){
        var x_data = {
            data: setting
        }
        $http.put('/settings/'+setting._id, x_data).then(function(rs){
            if(rs.data.responseCode == 0){
                toaster.pop('success', "Success ", "Settings saved!", 5000);
            }else{
                toaster.pop('error', "Error", "Update failed!", 5000);

            }
        })
    }

    $scope.add_variable_code = function(code,st){
        st.setting_value = st.setting_value + ' <'+code+'>';
    }
    $scope.get_list_account = function(){
        $http.post('/accounts', {}).then(function (rs) {
            if(rs.data.status === true){
                $scope.list_accounts = rs.data.results;
            }else{
                $scope.list_accounts = [];
                //err
            }
        })

        //Get list HF
        $http.post('/healthfacility/list', {}).then(function(rs){
            $scope.list_hf = rs.data.docs;
        }, function(){
            console.log('Error!');
        })
    }

    $scope.account_exist = false;
    $scope.check_exist_account = function(user_name){
        $scope.account_exist = false;
        var data_find = {
            find_type: "check_exist",
            username: user_name
        }
        $http.post('/accounts', data_find).then(function (rs) {
            if(rs.data.status === true){
                $scope.account_exist = (rs.data.results.length > 0 ? true : false);
            }else{
                $scope.account_exist = false;
                //err
            }
        })
    }


    $scope.open_editAccount = function(account_selected){
        $('#newAccount').modal('show');
        $scope.newacc = angular.copy(account_selected);
        $scope.newacc.is_edit = true;
        $scope.newacc.password = '';
        $scope.newacc.reporting_center = {
            selected : $scope.newacc.hf
        };
    }



    $scope.open_newacc_pop = function () {
        $('#newAccount').modal('show');

    }
    $scope.btnNewAccount = function (newacc) {
        var data_post = {
            username: newacc.username,
            password: newacc.password,
            hf: (newacc.reporting_center && newacc.reporting_center.selected ? newacc.reporting_center.selected : undefined),
            first_name: newacc.first_name,
            last_name: newacc.last_name,
            email: newacc.email,
            phone_number: newacc.phone_number,
            is_admin: newacc.is_admin
        }

        $http.post('/add_account', data_post).then(function (rs) {
            if(rs.data.status === true){
                toaster.pop('success', "Success ", "Account added!", 5000);
                ModalControl.closeModal('newAccount');
                //success
            }else{
                toaster.pop('error', "Error ", rs.data.message, 5000);
                //err
            }
        })
    }

    $scope.saveEditAccount = function(newacc){
        console.log(newacc);
        var data_post = {
            "data": {
            hf: (newacc.reporting_center && newacc.reporting_center.selected ? newacc.reporting_center.selected : undefined),
            first_name: newacc.first_name,
            last_name: newacc.last_name,
            email: newacc.email,
            phone_number: newacc.phone_number,
            is_admin: newacc.is_admin
        }
    }

        if(newacc.password.length > 0){data_post.data.password = sha1.hash(newacc.password)}
        $http.put('/accounts/'+newacc._id, data_post).then(function (rs) {
            if(rs.data.responseCode == 0){
                toaster.pop('success', "Success ", "Account updated!", 5000);
                ModalControl.closeModal('newAccount');
                $scope.get_list_account();
                //success
            }else{
                toaster.pop('error', "Error ", rs.data.responseMessage, 5000);
                //err
            }
        })
    }


    $scope.removeAccount = function(user_info){
        ConfirmBox.confirm('Are you sure?', 'Account '+user_info.username+' will be permanently removed! This action can not undo!').then(function() {
            $http.delete('/db_delete/accounts/' + user_info._id).then(function (rs) {
                if (rs.data.status == true) {
                    toaster.pop('success', "Success ", user_info.username+" has been removed!", 5000);
                    $scope.get_list_account();
                }
                else{
                    toaster.pop('error', "Error ", "Error, please try again!", 5000);
                    //err
                }
            })
        })

    }


});

angular.module('drugmonApp').controller('RegisterDrugCtrl', function($scope,$rootScope,$http,$stateParams,$location) {


})
