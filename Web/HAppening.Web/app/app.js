'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'firebase',
    'ngMap',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'angular-loading-bar',
    'socialLogin'
]).
    config(['$locationProvider', '$routeProvider', 'socialProvider', function ($locationProvider, $routeProvider, socialProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/view1' });
        socialProvider.setFbKey({ appId: "1643698609246838", apiVersion: "v2.5" });
    }]);
