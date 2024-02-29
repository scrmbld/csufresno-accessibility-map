
//create map
const map = L.map('map').setView([36.81254084216825, -119.74615523707597], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 14,
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
    L.latLng(36.834229236, -119.763303005),
    L.latLng(36.799524092, -119.727196132)
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
    `<form action="./submit" method="POST" class="popup-form">
        <label for="loc-description">Describe the location:</label><br>
        <textarea name="loc" id="loc-desc" maxlength="255" cols="30" rows="1" wrap="soft" required></textarea><br>
        <label for="desc">Describe the issue:</label><br>
        <textarea name="desc" id="desc" maxlength="255" cols="30" rows="5" wrap="soft" required></textarea><br>
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
