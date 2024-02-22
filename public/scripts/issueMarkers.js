//take a list of issues and make markers for each one
async function createMarkers(issues) {
    for (issue of issues) {
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
/*
const marker = L.marker([36.81377958775332, -119.74839213481263], {
    title: "test_title"
    }).addTo(map);
marker.bindPopup("<h1>E</h1> <br> Hello There!");
*/
//get the JSON of all the issues
async function reqIssues() {
    const response = await fetch("./issues.json");
    const issues = await response.json();
    //make map markers with that JSON data
    createMarkers(issues);
}