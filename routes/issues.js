const express = require("express");
const issuedb = require('../data');

const router = express.Router();

router.post("/", async (req, res) => {
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
    
    issuedb.writeIssueJSON();

    //send response to user
    res.send(`lat: ${req.body.lat}, long: ${req.body.lng} <br>issue: ${req.body.desc} <br>time: ${timeOfReq.toISOString()}`);
});

module.exports = router;