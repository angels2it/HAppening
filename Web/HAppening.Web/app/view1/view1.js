'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: '/app/view1/view1.html',
            controller: 'View1Ctrl as vm'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$firebaseArray', 'NgMap', '$http', '$timeout', function ($scope, $firebaseArray, NgMap, $http, $timeout) {
        $scope.lat = 40.710803, $scope.lng = -73.964040;
        $scope.events = [];


        NgMap.getMap().then(function (map) {
            $scope.map = map;
            $http.get(
                'http://localhost:3000/events?lat=40.710803&lng=-73.964040&distance=100&sort=venue&accessToken=1643698609246838|x5PaPO_3sPq-hbaHksVGSftGn5c')
                .success(function (data) {
                    data.events.forEach(function (event) {
                        $scope.events.push(event);
                    });

                })
                .error(function (error) {
                    alert('error when get data');
                });
        });
        $scope.showInfo = function (e, index) {
            $scope.event = $scope.events[index];
            $scope.map.showInfoWindow('infowindow', $scope.event.id);
        }
    }]);