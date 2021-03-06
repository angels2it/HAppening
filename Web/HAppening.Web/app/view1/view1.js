'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: '/app/view1/view1.html',
            controller: 'View1Ctrl as vm'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$firebaseArray', 'NgMap', '$http', '$timeout', '$rootScope', function ($scope, $firebaseArray, NgMap, $http, $timeout, $rootScope) {
        var baseUrl = "http://localhost:5000/";
        //var baseUrl = "https://happening-service.herokuapp.com/";
        function updateLatLng() {
            $scope.latlng = [$scope.lat, $scope.lng];
            searchEvents();
        }
        $scope.events = [];
        $scope.token = "";
        $scope.isLoading = false;
        function searchEvents() {
            var start = moment().unix();
            var end = moment().day(30).unix();
            $http.get(
                baseUrl + 'events?lat=' + $scope.lat + '&lng=' + $scope.lng +
                '&since=' + start +
                '&until=' + end +
                '&distance=10000&sort=venue&accessToken=1643698609246838|x5PaPO_3sPq-hbaHksVGSftGn5c')
                .success(function (data) {
                    data.events.forEach(function (event) {
                        if (_.find($scope.events,
                            function (e) {
                                return e.id == event.id;
                            }) !=
                            null)
                            return;
                        $scope.events.push(event);
                    });
                })
                .error(function (error) {
                    $scope.isLoading = false;
                    alert('error when get data');
                });
        }
        function getEventsByPageUserLiked() {
            var start = moment().unix();
            var end = moment().day(30).unix();
            $http.get(
                baseUrl + 'events?type=pages&lat=' + $scope.lat + '&lng=' + $scope.lng +
                '&since=' + start +
                '&until=' + end +
                '&distance=10000&sort=venue&accessToken=' + $scope.token)
                .success(function (data) {
                    data.events.forEach(function (event) {
                        if (_.find($scope.events,
                            function (e) {
                                return e.id == event.id;
                            }) !=
                            null)
                            return;
                        $scope.events.push(event);
                    });
                })
                .error(function (error) {
                    $scope.isLoading = false;
                    alert('error when get data');
                });
        }

        function getUserEvents() {
            $scope.isLoading = true;
            $http.get(
                'https://graph.facebook.com/v2.10/me/events?fields=id,type,name,start_time,end_time,description,picture.type(large),cover.fields(id,source),place.fields(id,name,location)&access_token=' + $scope.token)
                .success(function (data) {
                    data.data.forEach(function (event) {
                        if (event.place == null || _.find($scope.events,
                            function (e) {
                                return e.id == event.id;
                            }) !=
                            null)
                            return;
                        event.coverPicture = (event.cover ? event.cover.source : null);
                        event.profilePicture = (event.picture ? event.picture.data.url : null);
                        event.startTime = (event.start_time ? event.start_time : null);
                        event.endTime = (event.end_time ? event.end_time : null);
                        if (event.ticketing_terms_uri || event.ticketing_privacy_uri || event.ticket_uri) {
                            event.ticketing = {};
                            if (event.ticket_uri) event.ticketing.ticket_uri = event.ticket_uri;
                            if (event.ticketing_terms_uri) event.ticketing.terms_uri = event.ticketing_terms_uri;
                            if (event.ticketing_privacy_uri) event.ticketing.privacy_uri = event.ticketing_privacy_uri;
                        }
                        $scope.events.push(event);
                    });
                    $scope.isLoading = false;
                })
                .error(function (error) {
                    $scope.isLoading = false;
                    alert('error when get data');
                });
        }

        $rootScope.$on('event:social-sign-in-success',
            function (event, userDetails) {
                $scope.isLoggedIn = true;
                $scope.token = userDetails.token;
                getUserEvents();
                getEventsByPageUserLiked();
            });
        navigator.geolocation.getCurrentPosition(function (pos) {
            if (pos.coords == null) {
                alert('can not get your location');
                return;
            }
            $scope.lat = pos.coords.latitude, $scope.lng = pos.coords.longitude;
            NgMap.getMap().then(function (map) {
                $scope.map = map;
                updateLatLng();
            });


            $scope.showInfo = function (e, index) {
                $scope.event = $scope.events[index];
                $scope.map.showInfoWindow('infowindow', $scope.event.id);
            }
            $scope.placeMarker = function () {
                console.log(this.getPlace());
                var loc = this.getPlace().geometry.location;
                $scope.lat = loc.lat();
                $scope.lng = loc.lng();
                updateLatLng();
            };
            $scope.markerChange = function (event) {
                $scope.lat = event.latLng.lat();
                $scope.lng = event.latLng.lng();
                updateLatLng();
            };
        });
    }]);