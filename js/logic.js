// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// uncomment for quakes in the last hour
// queryUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


var myMap = L.map("map-id", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
 // , layers: [streetmap, earthquakes]
})



var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  

  return div;
};
// Add the info legend to the map
info.addTo(myMap);


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
   // console.log(feature.geometry)
   if (feature.properties.mag > 1){
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
     { radius : feature.properties.mag * 10000 , 
        color : getColor(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 1
      }).addTo(myMap)
      .bindPopup('Location:' + feature.properties.place +'<br>Magnitude:'  
      +  feature.properties.mag + '<br>URL: <a target="_blank" href="' + feature.properties.url + '" >'
      + feature.properties.url + '</a>', {
        maxWidth : 560
    })
    }
 //   layer.bindPopup("<h3>" + feature.properties.place +
  //    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

  updateLegend()

}


// Update the legend's innerHTML with the last updated time and station count
function updateLegend() {
  console.log('updating legend')
  document.querySelector(".legend").innerHTML = [
    '<i style="background:#f1eef6"></i> 0-1 <br>',
    '<i style="background:#d4b9da"></i> 1-2 <br>',
    '<i style="background:#c994c7"></i> 2-3 <br>',
    '<i style="background:#df65b0"></i> 3-4 <br>',
    '<i style="background:#dd1c77"></i> 4-5 <br>',
    '<i style="background:#980043"></i> 5+ <br>'
  ].join("");
}
function getColor(d) {
 
  return d >= 5 ? '#980043' :
         d >= 4  ? '#dd1c77' :
         d >= 3  ? '#df65b0' :
         d >= 2  ? '#c994c7' :
         d >= 1   ? '#d4b9da' :
         '#f1eef6';
}