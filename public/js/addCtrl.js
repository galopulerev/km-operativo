// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.

var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice', 'angularUtils.directives.dirPagination']);
//addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice, ngTableParams){
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    var distances = [];
    $scope.positions = [];

    $http.get('/positions').success(function(response){
        $scope.positions = response;
    }).error(function(){});

    $scope.calculateDistance = function() {
        //gservice.refresh(-0.146, -78.488, true);
        calculateAndDisplayRoute(gservice.directionsService, gservice.directionsDisplay, $scope);
        //$scope.positions[0].distance = distances[0];
        //$scope.positions[0].distance = distance;
    }

    var calculateAndDisplayRoute = function(directionsService, directionsDisplay, scope) {
        
        //var distances = [];
        var waypts;
        var i = 0;
        var j = 0;
        //Maximun way points
        var maxwp = 8;
        var maxleg = 8;
        var wpcont = 0;
        var legscont = 0;
        var tableIndex = 1;
        var laps = Math.floor(gservice.locations.length / maxwp);
        console.log("laps: " + laps);

        for (var icont = 0; icont < laps; icont++) {
            waypts = [];
            wpcont = 0;
            j = i + 1;
            
            if (icont >= laps - 1) {
                maxwp = 6;
            }
            
            
            while (wpcont < maxwp) {
                if (gservice.locations) {
                    console.log("j: " + j);
                    waypts.push({
                        location: gservice.locations[j].latlon,
                        stopover: true
                    });
                }
                j++;
                wpcont++;
                console.log(waypts);
            }
            
            directionsService.route({
                origin: gservice.locations[i].latlon,
                destination: gservice.locations[j].latlon,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    //distances.push(route.legs[0].distance.text);
                    legscont = 0;
                    while (legscont < maxleg) {
                        if (route.legs[legscont]) {
                            scope.positions[tableIndex].distance = route.legs[legscont].distance.text;
                        }
                        legscont++;
                        tableIndex++;
                    }
                    
                    scope.$apply();
                    //window.alert(route.legs[1].distance.value);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
            i = j;
            console.log("i: " + i);
        }

        
        //console.log(distances);
    }

    /*
    // Initializes Variables
    // ----------------------------------------------------------------------------
    //$scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        long = parseFloat(coords.long).toFixed(3);
        lat = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        //$scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh(lat, long);

    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
                
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    */
});