

//Google API
var googleAPI = {
    url: "https://maps.googleapis.com/maps/api/geocode/json?",
    key: "&key=AIzaSyDPNJxvmbwoFvXhVb9jH3TSGubXK5DKA1U"
};

;
var map;
var marker;

var mapLatLng = {
    lat: 38,
    lng: -97
};

var origin = {
    lat: 43.1530984,
    lng: -71.0054487
};

var destination = {
    lat: 34.1365402,
    lng: -118.3516809
};

var transit = {
    lat: origin.lat,
    lng: origin.lng
};


var inTransit = false;
var frameCount = 0;
var numberOfFrames = 35;
var intervalTime = 40;
var intervalID;


function initMap() {

    
    // Make a new map in the map div and set its center to the coordinates passed from localStorage
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapLatLng,
        zoom: 4.55
    });

    marker = new google.maps.Marker({
        position: origin,
        map: map,
        title: "Current Location",
    });


    // startAnimation();
};

function getDistanceFromOrigin(destCoords) {
    let absLat = Math.abs(destCoords.lat - origin.lat);
    let absLng = Math.abs(destCoords.lng - origin.lng);
    let latLngDist = Math.sqrt((absLat * absLat) + (absLng * absLng))
    return latLngDist
}

function startAnimation() {
    intervalID = setInterval(animateMarker, intervalTime);
    inTransit = true;

};

function animateMarker() {
    if (inTransit && frameCount < numberOfFrames) {

        let tempLat = transit.lat;
        let tempLng = transit.lng;

        let previousStop = {
            lat: tempLat,
            lng: tempLng
        };

        let latIncrement = ( destination.lat - origin.lat ) / numberOfFrames;
        let lngIncrement = ( destination.lng - origin.lng ) / numberOfFrames;

        transit.lat = tempLat + latIncrement;
        transit.lng = tempLng + lngIncrement;

        let flightPlanCoordinates = [
            transit,
            previousStop
        ];

        // marker.setMap(null);

        // marker = new google.maps.Marker({
        //     position: transit,
        //     map: map,
        //     title: "Current Location",
        // });

        let flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });



        // flightPath.setMap(null);
        flightPath.setMap(map);

        frameCount++;
    }
    else {
        clearInterval(intervalID);
        inTransit = false;
        frameCount = 0;
        transit.lat = origin.lat;
        transit.lng = origin.lng;
        marker = new google.maps.Marker({
            position: origin,
            map: map,
            title: "Current Location",
        });

    };

};

$("#go-button").on("click", function (){
    event.preventDefault();
    // Assign user's inputted address to inputAddress
    let inputAddress = $("#address-input").val();
    // numberOfFrames = parseInt($("#speed-input").val())

    // Perform an ajax call to the Google Geocode API
        $.ajax({
            url: googleAPI.url + "address=" + inputAddress + googleAPI.key,
            method: "GET",
        }).then(function (response) {
            console.log(response.results);


            let tempLat = response.results[0].geometry.location.lat;
            let tempLng = response.results[0].geometry.location.lng;
            destination.lat = tempLat;
            destination.lng = tempLng;


            $(".address-display").text(response.results[0].formatted_address);
            $("#lat-display").text(response.results[0].geometry.location.lat);
            $("#lng-display").text(response.results[0].geometry.location.lng);
            $("#global-geo").text(response.results[0].place_id);
            $("#distance-disp").text(getDistanceFromOrigin(destination));

            
            

            startAnimation();

            //Enable the View Map button by replacing the empty href with a link to the viewMap page
            // $("#map-redirect").attr("href","viewMap.html");
        });
})