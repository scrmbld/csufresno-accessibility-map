const express = require("express");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const compression = require('compression');
const helmet = require("helmet");

const issuedb = require('./data');

const app = express();
//port used by express
const port = 3300;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(compression()); //cpmpress all responses

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const userRouter = require("./routes/issues");

app.get('/', async (req, res) => {
    const issues = await issuedb.Issue.findAll();
    let markers = "";
    for (let i = 0; i < issues.length; i++) {
        let vals = issues[i].dataValues;
        //create the marker
        markers = markers + 
            `
            let m${i} = L.marker([${vals.lat}, ${vals.lng}], {
                title: "${vals.created}"
            }).addTo(map);
            m${i}.bindPopup("${vals.textbody}");
            `
    }
    res.render('index.ejs', {markers});
});

app.use(express.static("public"));

app.use('/issue', userRouter);

//start listening on the specified port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});