
## quick choropleth from (as yet unofficial) election results, nov. 5th 2025

- first, NYT data was scraped via python using BeautifulSoup, see `ipynb` file
- NTA (neighborhood tabulation area, shape files for map) downloaded from [nyc.gov](https://www.nyc.gov/content/planning/pages/resources/datasets/neighborhood-tabulation), saved as `nyc-nta.geojson`
- in `script.js`, neighborhood area data joined with `mayor_results.json` from scrape - using Leaflet to create and style map

## want to view this page locally?
- download the code folder
- if you have `python` ready on your machine:
  - open any [terminal](https://realpython.com/terminal-commands/)
  - type `python -m http.server` - press enter, and keep this connection open!
  - in a browser, go to `http://localhost:8000/`
  - this will load `index.html` and should show you a blue->red choropleth map of the election data by neighborhood
- in class btw I used `node.js` [http-server](https://www.npmjs.com/package/http-server), which does the same thing, easy as well if you already have node.js installed
 
(when working locally with a website that pulls in JS code, you usually need to spin up a local server so that the folder that holds your code can act like an IP address. browsers can restrict our access otherwise.)
