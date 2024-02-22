const map = L.map('map').setView([36.81254084216825, -119.74615523707597], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//create a box that encloses the campus
const campusBoundary = L.polygon([
    [36.82322923623916, -119.75430300511287],
    [36.808524092365715, -119.75430300511287],
    [36.808524092365715, -119.73619613195113],
    [36.82322923623916, -119.73619613195113]
]).addTo(map);

//add bounds to the map
const mapBoundary = L.latLngBounds(
    L.latLng(36.833229236, -119.764303005),
    L.latLng(36.798524092, -119.726196132)
);
map.setMaxBounds(mapBoundary);

//create explanation overlay -- tells the user how to use the site
const about = L.control({position: "topright"});
about.onAdd = (map) => {
    this._div = L.DomUtil.create('div', 'about');
    this._div.innerHTML = `<span>Click on the map to report an accessibility issue</span>`
    return this._div;
};
about.addTo(map);

//load data & create map markers for stored issues
reqIssues();

//at some point we will use this to allow users to report things
function onMapClick(e) {
    //the form that appears within the popup
    let entryContent = 
    `<form action="./submit" method="POST">
        <label for="desc">Report an accessibility issue:</label><br>
        <input type="text" name="desc" id="issue-desc" autocomplete="off" maxlength="255" required><br>
        <!-- also send the location of the report -->
        <input type="hidden" name="lat" id="issue-lat" value=${e.latlng.lat}>
        <input type="hidden" name="lng" id="issue-lng" value=${e.latlng.lng}>
        <input type="submit" value="Submit">
    </form>`;
    L.popup([0,0], {
        content: entryContent,
        autoPan: false
    }).setLatLng(e.latlng).openOn(map);
}





campusBoundary.on('click', onMapClick);
