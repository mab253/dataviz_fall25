let spaceStation;

async function getSpaceData() {
  let response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  let data = await response.json();
  console.log(data);
  refreshData(data);
}

// use the Leaflet library to create a map object, setView for a center near NYC, and choose a zoom
// https://leafletjs.com/reference.html#map-example

// use the Leaflet providers plugin to choose a basemap
// you can uncomment this code and change it: L.tileLayer.provider('Stadia.StamenWatercolor').addTo(map);
// you can uncomment this code: what does it add to the map? L.control.scale().addTo(map);

function refreshData(data) {
  // use the spaceStation variable already defined
  // and fill it with a new Leaflet marker, at the position of the lat/long of the ISS
  // https://leafletjs.com/reference.html#marker

  // find your markers! are they working?
  // make your map flyTo the marker when you add it:
  // https://leafletjs.com/reference.html#map-flyto

  // time!! ⏰
  // where is data.timestamp from?
  let dateObj = new Date(data.timestamp * 1000);
  let currentTime = dateObj.toUTCString();

  // how else can you use d3 to add more data to the info window?
  d3.select("div#timestamp").html(`<p>Data Last Updated: ${currentTime}`);

}

setInterval(getSpaceData, 2000); // every 2 seconds
