/*
  This is your site JavaScript code - you can add interactivity!
*/

console.log("hello 🌎");

var map = L.map("map").setView([40.71752688382958, -73.9895346631527], 11);

// this uses the "provider" plugin to load a basemap of your choice
// using this set:
// http://leaflet-extras.github.io/leaflet-providers/preview/index.html
L.tileLayer.provider("CartoDB.Positron").addTo(map);

///////////////////////////////////////////////////
//////// ADDING DATA! ////////////////////////////
//////////////////////////////////////////////////

// ADD YOUR DATA
async function addNTA() {
  // LOADING IN DATA

  let ntaURL =
    "nyc-nta.geojson";
  let resultsData = "mayor_results.json";
  const ntaResponse = await fetch(ntaURL);
  const dataResponse = await fetch(resultsData);

  // check your results in the console, did the data load?
  console.log(ntaResponse);
  console.log(dataResponse);

  // PARSING THE DATA AS JSON FORMAT
  const ntaData = await ntaResponse.json();
  const results = await dataResponse.json();

  // you can see the structued data itself in the console/inspector
  console.log(results);

  // NTA = neighborhood tabulation area
  // CREATING THE LAYER
  ntaLayer = L.geoJson(ntaData, {
    onEachFeature: function (feature, layer) {
      // what is going on here?
      // looping through both datasets to find where they MATCH

      let currentNTA;
      for (let i = 0; i < results.length; i++) {
        // fuzzy similarity, the names of neighborhoods aren't identical in each
        if (feature.properties.NTAName.includes(results[i].Neighborhood) || results[i].Neighborhood.includes(feature.properties.NTAName)) {
          currentNTA = results[i];
          break;
          // this breaks my loop; i am only working with the object where the
          // neighborhood names match, stored as currentNTA
        }
      }

      // NOW INTERACTIVE BEHAVIOR: what happens when I click that specific neighborhood?
      layer.on("click", function (e) {
        layer
          .bindPopup(
            `<strong>Neighborhood:</strong> ${currentNTA["Neighborhood"]}<br>
             <strong>Mamdani: </strong> ${currentNTA["Mamdani"]}<br>
             <strong>Cuomo:</strong> ${currentNTA["Cuomo"]}<br>`
          )
          .openPopup(); // Ensure popup opens after being dynamically bound
        let currentZoom = map.getZoom();
        let newZoom = currentZoom + 1;
        if (newZoom > 13) {
          newZoom = currentZoom;
        }
        map.flyTo(e.latlng, newZoom);
        // flying effect, zoom in on click (added)
      });

      // determine fillColor using an if-else structure
      let fillColor;
      let difference;
      if (currentNTA) {
        let mamdaniNumber = parseInt(currentNTA["Mamdani"].replace("%", ""));
        let cuomoNumber = parseInt(currentNTA["Cuomo"].replace("%", ""));
        // in my initial JSON scrape, these are strings, have to change type
        difference = mamdaniNumber - cuomoNumber;
        if (mamdaniNumber > cuomoNumber) {
          if (difference > 20) {
            fillColor = "#163791"; // dark blue, big win
          }
          else {
            fillColor = "#7CB9E8"; // light blue
          }
        } else {
          // what if cuomo won the area, what was the difference?
          // absolute value
          if (difference * -1 > 20) {
            fillColor = "#96060d"; // dark red, big win
          }
          else {
            fillColor = "#de2d26"; // lighter red
          }

        }
      }

      // NOW apply the style to the layer
      layer.setStyle({
        fillColor: fillColor, // use the color you chose from if/else, above
        weight: 1,
        color: "white", // boundary color
        dashArray: "3", // dotted lines
        fillOpacity: 0.8,
      });
    },
  }).addTo(map);
}

// want to see this with a sequential color scale from d3?
// replace fillColor in setStyle with getColor(difference) ...
// function defined here:
function getColor(d) {
  let colorScale = d3.scaleSequential(d3.interpolateCividis).domain([7, 60]);
  return colorScale(d);
}
// more documentation on d3 color sequences: 
// https://d3js.org/d3-scale-chromatic/sequential
// you'll recognize some names from seaborn!

// add a custom legend control
const legend = L.control({ position: "bottomright" });

// what more code do you need for the legend to work?
// check out the Leaflet choropleth tutorial example:
// https://leafletjs.com/examples/choropleth/

legend.onAdd = function (map) {
  // create a div container for legend
  const div = document.createElement("div");
  div.id = "legend";
  // check out style.css - I can now select this div

  // make an object, list of the legend fields
  const legendItems = [
    { color: "#163791", label: "Mamdani - 30+ %" },
    { color: "#7CB9E8", label: "Mamdani - <30 %" },
    { color: "#96060d", label: "Cuomo - 30+ %" },
    { color: "#de2d26", label: "Cuomo - <30 %" },
  ];

  // add a title
  div.innerHTML = "<strong>Legend</strong><br>";

  // loop through the items in legend list you made
  // and create a legend entry (div) for each
  legendItems.forEach(function (item) {
    div.innerHTML += `
            <div>
                <div style="
                    background: ${item.color};
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8px;
                    margin-bottom:5px;
                    opacity: 0.7;
                "></div>${item.label}
            </div>
        `;
  });

  return div;
}

legend.addTo(map);


//////////////////////////////////////////////////
//////// NOW /////////////////////////////////////
//////////////////////////////////////////////////

/* after all that we have not added anything to the map yet!
  FINALLY we call the function to add our layers!   */

addNTA();

//////////////////////////////////////////////////
// check out this example for more:
// https://leafletjs.com/examples/choropleth/
//////////////////////////////////////////////////
