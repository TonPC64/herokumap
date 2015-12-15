angular.module('ionicApp', ['ionic', 'ngMap'])

.controller('MarkerRemoveCtrl', function($http, $scope, $ionicLoading, $interval) {

    $scope.positions = []

    $scope.$on('mapInitialized', function(event, map) {
        $scope.map = map
    })

    var socket = io.connect()
    $scope.nameuser = "Ton"
    socket.emit('user', {
        User: $scope.nameuser
    })


    socket.on('push', function(data) {
        console.log(data)
        $scope.positions.push(data)
        $scope.$apply()
    })

    $scope.centerOnMe = function() {
        $scope.positions = []

        $ionicLoading.show({
            template: 'Loading...'
        })

        
        var generateMarkers = function() {
            $scope.positions = [];
            var numMarkers =1; //between 4 to 8 markers
            for (i = 0; i < numMarkers; i++) {
              
                $scope.positions.push({
                    lat: $scope.loc.lat,
                    lng: $scope.loc.lng,
                    name: $scope.nameuser
                });
            }
            console.log("vm.positions", vm.positions);
        };

        $interval(generateMarkers, 2000);

        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            $scope.positions.push({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            console.log(pos)
            $scope.map.setCenter(pos)
            $ionicLoading.hide()
            socket.emit('shareLoc', {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: $scope.nameuser
            })
        })

    }

    init()


      function init(){
      if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(initposition)
        } else {
            x.innerHTML = 'Geolocation is not supported by this browser.'
        }
    }
    $interval(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition)
        } else {
            x.innerHTML = 'Geolocation is not supported by this browser.'
        }
    }, 500)

    function showPosition(position) {
        $scope.loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        $scope.$apply()
    }

    function initposition(position) {
        $scope.initloc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        $scope.$apply()
    }

})
