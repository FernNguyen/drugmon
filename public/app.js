'use strict';

angular.module('myApp', [
  'ui.router','ngSanitize','ui.select'
]).config(function($stateProvider, $urlRouterProvider,$locationProvider) {


    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/app.html',
        controller: 'AppCtrl'
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

}); 