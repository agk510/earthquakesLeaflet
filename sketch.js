// LEAFLET.JS EARTHQUAKE VISUALIZATION
// USGS DATA - SOURCE UPDATED EVERY 5 MINUTES
// JavaScript library available at http://leafletjs.org/

var map; // global
var canvas; // p5 canvas
var quakes = []; // array of earthquakes 
var mags = []; // array of magnitudes
var slider; // UI for setting minimum magnitude
var magnitude; // div for storing min magnitude from slider 

function setup() {
  canvas = createCanvas(windowWidth, windowHeight); // full window p5 canvas
  canvas.parent('map'); // make p5 and leaflet use the same canvas (and z-index)
  initLeaflet(); // load leaflet functions and creat map and defined view
  loadStrings("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv", parseSource); // load source, parse when done

  // title context
  var div = createDiv('<b>Earthquakes Today</b>');
  div.id("top");
  div.position(30, 35);
  
  // differentiate legend from map
  var txt = createDiv('');
  txt.id("top-bg");
  txt.position(0, 0);

  // UI slider
  slider = createSlider(0, 10, 1);
  slider.id("top");
  slider.position(width-450, 25);

  // slider numeric feedback
  magnitude = createDiv('Min magnitude: ' + slider.value());
  magnitude.id("top");
  magnitude.position(width - 250, 35);
}

function draw() {
  // hide and show individual quakes by checking against slider threshold
  for (var i = 1; i < mags.length; i++) {
    if (mags[i] < slider.value())
      quakes[i].setRadius(0);
    else
      quakes[i].setRadius(mags[i]);
  }

  magnitude.html("Magnitude > " + slider.value() + " RS");
}

function setColor(_magnitude) {
  var startColor = color(50, 50, 255);
  var endColor = color(255, 50, 50);
  var interpolatedColor = lerpColor(startColor, endColor, _magnitude / 10);
  return interpolatedColor;
}

function parseSource(data) {
  for (var i = 1; i < data.length; i++) {
    var row = split(data[i], ","); // split every row by the comma
    mags[i] = row[4];
    // create custom leaflet marker
    quakes[i] = L.circleMarker([row[1], row[2]], {
      stroke: true,
      color: '#232323',
      weight: 1,
      opacity: 0.3,
      fillOpacity: 0.8,
      fillColor: setColor(row[4]),
    });

    var place = row[13].substr(1);

    quakes[i].addTo(map).setRadius(mags[i]).bindPopup("<b>" + 
    row[4] + "</b> magnitude, " + place); // make new labeled markers at lat, lon, 
  }
}

// init leaflet using a custom mapbox
function initLeaflet() {
  // your access token here
  L.mapbox.accessToken = 'pk.eyJ1IjoiY3Jvb2tvb2tvbyIsImEiOiJoSWZlQWhnIn0.BZsl4HSikEgkLjem-3Y8CQ';
  map = L.mapbox.map('map', 'mapbox.run-bike-hike').setView([20, 0], 2);

  function onMapClick(e) {
    // leaflet needs this function, no need to do anything here
  }

  map.on('click', onMapClick);
}