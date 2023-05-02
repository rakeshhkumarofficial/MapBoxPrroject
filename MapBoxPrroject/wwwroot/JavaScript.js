var map;

function initializeMap() {
    // Create a new map object
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9vc2hpIiwiYSI6ImNsaDRjeTBiazBqeG0zZ281enNzOXR4cjcifQ.eLxwYoRL5rhHhQxjv9mZkg';
    map = new mapboxgl.Map({
        container: document.getElementById("map"), // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 4, // starting zoom
    });

    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        }),
    );

    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }),
        'top-left'
    );

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
    });
    var origin = [74.87469, 31.63174];
    var destination = [77.1025, 28.7041];

    directions.setOrigin(origin);
    directions.setDestination(destination);

    map.addControl(
        directions,
        'top-left'
    );


    // Add a marker at the initial location
    // Create a new marker.
    var marker = new mapboxgl.Marker()

    // Add a click listener to the map
    map.on('click', function (event) {
        // Remove the existing marker
        marker.remove();

        // Add a new marker at the clicked location
        // Set marker options.
        marker = new mapboxgl.Marker({
            color: "#00FF00",
            draggable: true
        }).setLngLat([event.lngLat.lng, event.lngLat.lat])
            .addTo(map);

        // Call the pinLocation method on the C# component with the new latitude and longitude
        DotNet.invokeMethodAsync("GoogleMapAPIProject", "PinLocation", event.lngLat.lat, event.lngLat.lng);

    });
}