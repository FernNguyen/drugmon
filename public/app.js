'use strict';

angular.module('drugmonApp', [
  'ui.router','ngSanitize','ui.select','toaster','ngDialog'
]).config(function($stateProvider, $urlRouterProvider,$locationProvider) {


    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/app.html',
        controller: 'AppCtrl'
    }).state('login', {
        url: '/login.html',
        templateUrl: 'app/login.html',
        controller: 'AccountCtrl'
    }).state('reports', {
        url: '/reports.html',
        templateUrl: 'app/reports.html',
        controller: 'ReportCtrl'
    }).state('healthfacility', {
        url: '/health-facility.html',
        templateUrl: 'app/health_facility.html',
        controller: 'HFCtrl'
    }).state('setting', {
        url: '/setting.html',
        templateUrl: 'app/setting.html',
        controller: 'SettingCtrl'
    }).state('drugs', {
        url: '/drugs.html',
        templateUrl: 'app/drugs.html',
        controller: 'DrugsCtrl'
    });
    // $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });


}).run(function () {

}).factory('ModalControl', function(){
    return {
        closeModal:function(modal_id){
        var $modal = $('#'+modal_id);
        //when hidden
        // $modal.on('hidden.bs.modal', function(e) {
        //     return this.render(); //DOM destroyer
        // });
        $modal.modal('hide'); //start hiding
        }
    }
})
.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-plain',
        plain: true,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}])

.service('ConfirmBox', function(ngDialog){
    this.confirm = function (title,content) {
        var confirm_sl =  ngDialog.openConfirm({
            className: 'ngdialog-theme-default',
            template:'<link href="assets/css/ngDialog.css" rel="stylesheet" type="text/css" />\
		   <style>\
            button:focus {\
            outline:0;\
            box-shadow: inset 0 0 0 1px #27496d,0 2px 3px #193047;\
            }\
        </style>\
        <div class="modal-header" style="margin: -10px -10px 0px -10px;height:30px;">\
        <h5 class="modal-title" style="margin-top:-6px">' + title +'</h5></div>\
        <div class="modal-body">\
        <div style="color:red;">' + content +'</div>\
    </div>\
    <div class="ngdialog-buttons">\
        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)" ng-enter="confirm(1)">Confirm</button>\
        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" ng-enter="closeThisDialog(0)">Cancel</button>\
        </div>',
            plain: true
        });
        return confirm_sl;
    };
});

