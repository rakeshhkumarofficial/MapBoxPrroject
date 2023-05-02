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

    map.addControl(new mapboxgl.NavigationControl());

    // Make a request to the Mapbox Directions API to retrieve cycling directions
    var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78-77.03,38.91?access_token='+ mapboxgl.accessToken;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Add the route to the map
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: data.routes[0].geometry.coordinates
                        }
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });

            // Zoom the map to fit the route
            var bounds = data.routes[0].geometry.coordinates.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(data.routes[0].geometry.coordinates[0], data.routes[0].geometry.coordinates[0]));
            map.fitBounds(bounds, { padding: 50 });
        });


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