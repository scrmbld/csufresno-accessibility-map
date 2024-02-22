const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const fs = require("fs");

const dev_db_name = 'cynthia';
const dev_db_passwd = 'word';

//initialize sequelize
const sequelize = new Sequelize('accessibility', process.env.MYSQL_USER || dev_db_name, process.env.MYSQL_PASSWD || dev_db_passwd, {
    host: 'localhost',
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

//return array of all issues in database
async function getAllIssues() {
    const rawIssues = await Issue.findAll();
    let issues = [];
    for (issue of rawIssues) {
        issues.push(issue);
    }
    return issues;
}

//writes all issues into issues.json where the client can access them
async function writeIssueJSON(issues = null) {
    //get issues if they are not provided
    if (!issues) {
        issues = getAll();
    }
    //overwrite issues.json
    fs.writeFileSync('./public/issues.json', JSON.stringify(issues));
}

module.exports = {getAllIssues, writeIssueJSON};