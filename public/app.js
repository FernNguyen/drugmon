'use strict';

angular.module('myApp', [
  'ui.router'
]).config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    
    $stateProvider.state('app', {
        url: '/',
        templateUrl: 'app/app.html',
        controller: 'AppCtrl'
    }).state('reports', {
        url: '/reports',
        templateUrl: 'app/reports.html',
        controller: 'ReportCtrl'
    })
    ;
    
}).run(function () {

}); 