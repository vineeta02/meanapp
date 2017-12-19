angular.module('gservice', [])
    .factory('gservice', function($http){

        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Default selected Location 
        var selectedLat = 39.50;
        var selectedLong = -98.35;
        var distance = 50; //50km;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude,get_nearby_locations=false){

            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = parseFloat(latitude);
            selectedLong = parseFloat(longitude);

            // Perform an AJAX call based on get_nearby_locations parameter
            if(get_nearby_locations)
                url = '/get_nearby_places?location='+selectedLong+"&location="+selectedLat+"&distance="+distance
            else
                url = "/places/?location="+selectedLong+"&location="+selectedLat
            $http.get(url).then(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);

                // Initialize the map.
                initialize(selectedLat, selectedLong);
            }).catch(function(){});
        };



        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response

            for(var i= 0; i < response.data.length; i++) {
                var place = response.data[i];
                d = new Date()
                day = d.getDay()
                if(day){
                    var opening_hour = place.opening_hours[day-1] 
                }
                else
                    var opening_hour = place.opening_hours[6]

                // Create popup windows for each record
                var  contentString =
                    '<p><b>Place</b>: ' + place.name +
                    '<br><b>Address</b>: ' + place.address +
                    '<br><b>rating</b>: ' + place.rating +
                    '<br><b>Opening Hours</b>: ' + opening_hour + 
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(place.location[1], place.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    name: place.name,
                    address: place.address,
                    rating: place.rating
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: myLatLng
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: n.name,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location as a bouncing red marker
    // var initialLocation = new google.maps.LatLng(latitude, longitude);
    // var marker = new google.maps.Marker({
    //     position: initialLocation,
    //     animation: google.maps.Animation.BOUNCE,
    //     map: map,
    //     icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    // });
    // lastMarker = marker;

};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});