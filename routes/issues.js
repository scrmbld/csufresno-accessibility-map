const express = require("express");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const issuedb = require('../data');
const router = express.Router();

router.post("/", (req, res) => {
    const timeOfReq = new Date(Date.now());
    console.log(Date.now(), ': new report received');
    
    
    try {
        const result = issuedb.sequelize.transaction(async (t) => {
 
            //insert into database
            const issue = issuedb.Issue.create({
                lat: req.body.lat,
                lng: req.body.lng,
                textbody: req.body.desc
            }, {transaction: t});

            return issue;
    });
    } catch (error) {
        //if the insert doesn't work
        res.status(500).send( {error: 'unable to log issue'} );
    }
    
    //send response to user
    res.send(`lat: ${req.body.lat}, long: ${req.body.lng} <br>issue: ${req.body.desc} <br>time: ${timeOfReq.toISOString()}`);
});

module.exports = router;