const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app','root','mysqlpassword', {
    dialect: "mysql",
    host: "localhost",
    port: "4406"
});

module.exports = sequelize;