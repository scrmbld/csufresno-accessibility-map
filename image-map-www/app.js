const express = require("express");
const compression = require('compression');
const helmet = require("helmet");

const app = express();
//port used by express
const port = process.env.LISTEN_PORT || 3300;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(compression()); //compress all responses

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'"],
                "style-src": "'self'",
                "img-src": ["'self'", "tile.openstreetmap.org", "data:"]
            }
        }
    })
);

const mapRouter = require("./routes/index");

app.use(express.static("public"));

app.use('/', mapRouter);

//syncronise issue table
const issuedb = require("./data");
issuedb.checkTables();

//start listening on the specified port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
