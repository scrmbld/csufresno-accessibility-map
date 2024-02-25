const express = require("express");
const issuedb = require('../data');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const router = express.Router();

router.use('/submit', limiter)

//accept form submission for a new issue report
router.post('/submit', async (req, res) => {
    
    //do SQL stuff
    const timeOfReq = new Date(Date.now());
    console.log(Date.now(), ': new report received from', req.ip);
    
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