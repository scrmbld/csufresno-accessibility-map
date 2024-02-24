const express = require("express");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const compression = require('compression');
const helmet = require("helmet");

//check the database on startup
const issuedb = require('./data');
issuedb.checkTables();

const app = express();
//port used by express
const port = 3300;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(compression()); //compress all responses

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'"],
                "stye-src": null,
                "img-src": ["'self'", "tile.openstreetmap.org", "data:"]
            }
        }
    })
);

const mapRouter = require("./routes/index");

app.use(express.static("public"));

app.use('/', mapRouter);

//start listening on the specified port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});