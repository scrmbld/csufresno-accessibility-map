const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");
const striptags = require("striptags");

const dev_db_name = 'cynthia';
const dev_db_passwd = 'word';

//wait 10 seconds before doing this (stupid stupid solution)
(async function() {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(10000)
    })()
    
//initialize sequelize
const sequelize = new Sequelize('accessibility', process.env.MYSQL_USER || dev_db_name, process.env.MYSQL_PASSWD || dev_db_passwd, {
    host: process.env.MYSQL_HOSTNAME || 'localhost',
    port: process.env.MYSQL_PORT || '33060',
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('MySQL Conenction has been established successfully');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//the model for issues -- identifier, coordinates, user entered text, and creation date
const Issue = sequelize.define("Issue", {

    identifier: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    lng: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    textbody: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    timestamps: true,
    createdAt: "created",
    updatedAt: false
});

function checkTables() { sequelize.sync(); }

//return array of all issues in database
async function getAllIssues() {

    //request the database
    const issues = await Issue.findAll();
    
    return issues;
}

//takes a post request and writes an issue to the database
async function writeIssueDB(req) {

    const result = sequelize.transaction((t) => {
    
        //insert into database
        const issue = Issue.create({
            lat: req.body.lat,
            lng: req.body.lng,
            textbody: striptags(req.body.desc),
        }, {transaction: t});
    
        return issue;
    });

}

module.exports = {getAllIssues, writeIssueDB, checkTables};