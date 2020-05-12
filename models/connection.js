var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_test'
});

connection.connect(function () {
    console.log("Database connected");
});

module.exports = connection;
