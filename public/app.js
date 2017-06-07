'use strict';

angular.module('myApp', [
  'ui.router'
]).config(function($stateProvider, $urlRouterProvider,$locationProvider) {

    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/app.html',
        controller: 'AppCtrl'
    }).state('reports', {
        url: '/reports',
        templateUrl: 'app/reports.html',
        controller: 'ReportCtrl'
    }).state('healthfacility', {
        url: '/health-facility',
        templateUrl: 'app/health_facility.html',
        controller: 'HFCtrl'
    }).state('setting', {
        url: '/setting',
        templateUrl: 'app/setting.html',
        controller: 'SettingCtrl'
    });
    $locationProvider.html5Mode(true);
}).run(function () {

}); 