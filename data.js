const { Sequelize, Op, Model, DataTypes } = require("sequelize");

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

module.exports = {Issue, sequelize};