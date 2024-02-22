const express = require("express");
const issuedb = require('../data');

const router = express.Router();

//accept form submission for a new issue report
router.post('/submit', async (req, res) => {
    
    //do SQL stuff
    const timeOfReq = new Date(Date.now());
    console.log(Date.now(), ': new report received');

    try {
        await issuedb.writeIssueDB(req);
    } catch (error) {
        //if the insert doesn't work
        console.error(error);
        res.status(500).send("internal server error");
        return;
    }

    //redirect user on success
    res.redirect('index.html');

    //await issuedb.writeIssueJSON();
});

//send all issues in database to client in JSON form
router.get('/issues', async (req, res) => {
    let issues = await issuedb.getAllIssues();
    res.json(JSON.stringify(issues));
});

module.exports = router;