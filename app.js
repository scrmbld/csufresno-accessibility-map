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

app.use(compression()); //compress all responses

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

const userRouter = require("./routes/issues");

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.use(express.static("public"));

app.use('/issue', userRouter);

//start listening on the specified port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});