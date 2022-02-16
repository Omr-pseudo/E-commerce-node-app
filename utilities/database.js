const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-app',
    password:'mysqlpassword',
    port:4406
}); 

module.exports = pool.promise();