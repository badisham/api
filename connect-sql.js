// const mysql = require('mysql');
import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lalanote',
    port: 3312,
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Database connected successfully :) !');
});

export async function mysqlQuery(query, req) {
    return new Promise(function (resolve, reject) {
        connection.query(query, req, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
// default
// module.exports = connection;
// export default connection;
