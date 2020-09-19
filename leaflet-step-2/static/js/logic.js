// Creating map object
// var myMap = L.map("map", {
//     center: [40.77, -111.89],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });
  
// Adding tile layer to the map
// var lightmap= L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
//   "access_token={accessToken}",{
//     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//     maxZoom: 18,
//     accessToken: API_KEY
// }).addTo(myMap);

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
  // earthquakes.addTo(myMap);

// create legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2, 3, 4, 5, 6, 7],
        labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

// plate tectonics boundaries
var boundaries= "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(boundaries, function(tectonics) {
  boundaryFeatures(tectonics.features);
  console.log(tectonics); 
});

// function style2(feature) {
//   return {
//       weight: 2,
//       opacity: 1,
//       color: 'white',
      
// };
function boundaryFeatures(platedata){
  var platetectonics= L.geoJSON(platedata)
  // ,{
  //   style2: style2,
  // });

 // Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var lightmap= L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token={accessToken}",{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
})

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Light Map": lightmap,
  "satellite": satellite
};

// Create overlay object to hold our overlay layer
var overlayMaps = {
  Earthquakes: earthquakes,
  Platetectonics: platetectonics
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [lightmap, streetmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

legend.addTo(myMap);


// .addTo(myMap);

}

}


