// Creating map object
var myMap = L.map("map", {
    center: [40.77, -111.89],
    zoom: 5
  });
  
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token={accessToken}",{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
  var geodata = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Grab data with d3
d3.json(geodata, function(data) {
    createFeatures(data.features);
    console.log(data); 
  });


function createFeatures(earthquakeData) { 
//  function to set cirlce markers based on magnitude
  function getColor(magnitude) {
    return magnitude > 7 ? '#d73027' :
           magnitude > 6 ? '#fc8d59' :
           magnitude > 5  ? '#fee08b' :
           magnitude > 4  ? '#d9ef8b' :
           magnitude > 3  ? '#91cf60' :
           magnitude > 2  ? '#1a9850' :
                      '#FFEDA0';
}
// function that changes marker size based on magnitute
    function getRadius(mag){
        return mag * 2
}
// function to style circle markers
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            weight: 2,
            opacity: 1,
            color: 'white',
            radius: getRadius(feature.properties.mag),
            fillOpacity: 0.7
    };
}
// fnction to create popup with info for each earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }

// add GeoJSON layer to the map
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: style,
  });
//   add onto map
  earthquakes.addTo(myMap);


// create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2, 3, 4, 5, 6, 7],
        // colors = ['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850']
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

}


