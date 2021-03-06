// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};
    // Handling Clicks and location selection
    googleMapService.clickLat  = 0;
    googleMapService.clickLong = 0;

    // Array of locations obtained from API calls
    //var locations = [];

    // Selected Location (initialize to center of America)
    var selectedLat = -0.146;
    var selectedLong = -78.488;

    // Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
    googleMapService.refresh = function(latitude, longitude, calculate){

        // Clears the holding array of locations
        googleMapService.locations = [];

        // Set the selected lat and long equal to the ones provided on the refresh() call
        selectedLat = latitude;
        selectedLong = longitude;

        // Perform an AJAX call to get all of the records in the db.
        $http.get('/positions').success(function(response){

            // Convert the results into Google Map Format
            googleMapService.locations = convertToMapPoints(response);

            // Then initialize the map -- noting that no filter was used.
            initialize(latitude, longitude);
        }).error(function(){});
    };

    // Private Inner Functions
    // --------------------------------------------------------------
    // Convert a JSON of users into map points
    var convertToMapPoints = function(response){

        // Clear the locations holder
        var locations = [];

        // Loop through all of the JSON entries provided in the response
        for(var i= 0; i < response.length; i++) {
            var position = response[i];

            // Create popup windows for each record
            var  contentString =
                '<p><b>ID</b>: ' + position.id +
                '<br><b>Fecha</b>: ' + position.created_at +
                '</p>';

            // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
            locations.push({
                latlon: new google.maps.LatLng(position.location[1], position.location[0]),
                message: new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 320
                }),
                id: position.id
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude) {

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};
        /*
        if(!googleMapService.directionsService){
            googleMapService.directionsService = new google.maps.DirectionsService;
        }

        if(!googleMapService.directionsDisplay){
            googleMapService.directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                suppressInfoWindows: true
            });
        }
        */
        // If map has not been created...
        if (!googleMapService.map){

            // Create a new map and place in the index.html page
            googleMapService.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: myLatLng
            });
        }

        //googleMapService.directionsDisplay.setMap(map);

        // If a filter was used set the icons yellow, otherwise blue
        //if(filter){
            //calculateAndDisplayRoute(googleMapService.directionsService, googleMapService.directionsDisplay);
            //icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        //}
        //else{
            icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        //}

        // Loop through each location in the array and place a marker
        googleMapService.locations.forEach(function(n, i){
            var marker = new google.maps.Marker({
                position: n.latlon,
                map: googleMapService.map,
                title: "Big Map",
                icon: icon,
            });

            // For each marker created, add a listener that checks for clicks
            google.maps.event.addListener(marker, 'click', function(e){

                // When clicked, open the selected marker's message
                currentSelectedMarker = n;
                n.message.open(googleMapService.map, marker);
            });
        });
        /*
        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: initialLocation,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        lastMarker = marker;

        // Function for moving to a selected location
        map.panTo(new google.maps.LatLng(latitude, longitude));
        
        // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', function(e){
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // When a new spot is selected, delete the old red bouncing marker
            if(lastMarker){
                lastMarker.setMap(null);
            }

            // Create a new red bouncing marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            // Update Broadcasted Variable (lets the panels know to change their lat, long values)
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            $rootScope.$broadcast("clicked");
        });
        */
        
    };
    //This method was passed to addCtrl.js
    /*
    var calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
        
        var waypts = [];
        for (var i = 1; i < locations.length - 28; i++) {
            if (locations) {
                waypts.push({
                    location: locations[i].latlon,
                    stopover: true
                });
            }
        }
        
        
        directionsService.route({
            origin: locations[0].latlon,
            destination: locations[locations.length - 28].latlon,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                window.alert(route.legs[0].distance.text);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    */
    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load',
        googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
});