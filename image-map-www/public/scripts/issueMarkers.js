//what you see when you click on a marker
function makeMarkerContent(locText, outText, createdText) {

    let content =
        `
        <div class='loc-display'>
            <strong>Location: </strong>
            <span>${locText}</span>
        </div>
        <div class='desc-display'>
            <strong>Description: </strong>
            <span>${outText}</span>
        </div>
        <div>
            <strong>Created: </srong>
            <span>${createdText}</span>
        </div>
        `;
    return content;
}

//take a list of issues and make markers for each one
async function createMarkers(issues, group) {
    for (issue of issues) {
        if (issue.lat == null || issue.lng == null) {
            continue;
        }
        //protect ourselves from XSS in the issue descriptions
        let outText = DOMPurify.sanitize(issue.textbody);
        if (!outText) continue;
        let locText = DOMPurify.sanitize(issue.locname);
        if (!locText) continue;

        //remove the time from the creation datetime & rearrange to mm:dd:yyyy
        let createdText = issue.created.replace(/T.*/, "");
        createdText = createdText.split("-");
        createdText = createdText[1].concat("-", createdText[2], "-", createdText[0]);

        //create the marker
        let new_marker = L.marker([issue.lat, issue.lng]);
        new_marker.bindPopup(makeMarkerContent(locText, outText, createdText));

        group.addLayer(new_marker);
    }
}

//get the JSON of all the issues
async function reqIssues(group) {

    const response = await fetch("issues");
    const issues = await response.json();

    createMarkers(JSON.parse(issues), group);
}
