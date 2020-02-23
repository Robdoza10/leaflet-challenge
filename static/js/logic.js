var map = L.map('map').setView([44.68, -63.74], 3);

var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1Ijoicm9iZG96YTEwIiwiYSI6ImNrM3RkY25tdjAxcHIzbm10azJ1eGd4N2oifQ.sTqGPT23EjXJsTze2-3f3w"
}).addTo(map);

function radius(magnitude) {
  return magnitude * 5;
}

function color(magnitude) {
  return magnitude > 5 ? '#F30':
  magnitude > 4  ? '#F60':
  magnitude > 3  ? '#F90':
  magnitude > 2  ? '#FC0':
  magnitude > 1  ? '#FF0':
            '#9F3';
}

function createFeatures(features) {
  function pointToLayer(feature, latlng) {
    let markerStyle = {
      stroke: true,
      weight: 1,
      fillOpacity: 0.75,
      fillColor: color(feature.properties.mag),
      color: "white",
      radius: radius(feature.properties.mag)
    };
    return new L.circleMarker(latlng, markerStyle);
  }
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br> Magnitude: " + feature.properties.mag +"</p>");
  }

  L.geoJSON(features, {
    onEachFeature,
    pointToLayer,
  }).addTo(map);

  var legend = L.control({position: "bottomright"});

  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
    
    for (var i=0, ii=grades.length; i<ii; i++) {
      div.innerHTML += 
        '<i style="background: ' + color(grades[i] + 1) + '"></i>' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(map);
}

d3.json(earthquakeUrl, function(data) {
  createFeatures(data.features)
})
