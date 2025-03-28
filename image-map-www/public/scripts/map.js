
//create map

let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const map = L.map('map', {
    center: [36.81254084216825, -119.74615523707597],
    zoom: 17,
    layers: [osm]
});

//load data & create map markers for stored issues
let markers = L.layerGroup();
reqIssues(markers);
markers.addTo(map) // this enables these in the layer control by default

//create explanation overlay -- tells the user how to use the site
const about = L.control({ position: "topright" });
about.onAdd = (map) => {
    this._div = L.DomUtil.create('div', 'about');
    this._div.innerHTML = `<span>Click on the map to report an accessibility issue</span>`
    return this._div;
};
about.addTo(map);

//create a box that encloses the campus
let campusBoundary = L.polygon([
    [36.82322923623916, -119.75430300511287],
    [36.808524092365715, -119.75430300511287],
    [36.808524092365715, -119.73619613195113],
    [36.82322923623916, -119.73619613195113]
])
campusBoundary.addTo(map);

let baseMaps = {
    "OpenStreetMap": osm
};

let overlayMaps = {
    'Markers': markers
}

//add bounds to the map
const mapBoundary = L.latLngBounds(
    L.latLng(36.884229236, -119.823303005),
    L.latLng(36.729524092, -119.667196132)
);
map.setMaxBounds(mapBoundary);

var layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    hideSingleBase: true
}).addTo(map);


function onMapClick(e) {
    //the form that appears within the popup
    let entryContent =
        `<form action="./submit" method="POST" class="popup-form">
        <label for="loc-description">Describe the location:</label><br>
        <textarea name="loc" id="loc-desc" maxlength="2048" cols="30" rows="1" wrap="soft" required></textarea><br>
        <label for="desc">Describe the issue:</label><br>
        <textarea name="desc" id="desc" maxlength="2048" cols="30" rows="5" wrap="soft" required></textarea><br>
        <!-- also send the location of the report -->
        <input type="hidden" name="lat" id="issue-lat" value=${e.latlng.lat}>
        <input type="hidden" name="lng" id="issue-lng" value=${e.latlng.lng}>
        <input type="submit" value="Submit">
    </form>`;
    L.popup([0, 0], {
        content: entryContent,
        autoPan: false
    }).setLatLng(e.latlng).openOn(map);
}

campusBoundary.on('click', onMapClick);
