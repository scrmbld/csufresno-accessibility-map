//take a list of issues and make markers for each one
async function createMarkers(issues) {
    for (issue of issues) {
        console.log(issue);
        //protect ourselves from XSS in the issue descriptions
        let outText = DOMPurify.sanitize(issue.textbody);
        if (!outText) continue;
        
        //remove the time from the creation datetime
        let createdText = issue.created.replace(/T.*/, "");
        
        //create the marker
        let new_marker = L.marker([issue.lat, issue.lng]).addTo(map);
        new_marker.bindPopup(`${outText}<br><br><b>Created: </b>${createdText}`);
    }
}

//get the JSON of all the issues
async function reqIssues() {
    const response = await fetch("issues");
    const issues = await response.json();
    
    console.log(JSON.parse(issues));
    createMarkers(JSON.parse(issues));
}