const mysql = require('mysql')
require('dotenv').config();

const dbconfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
}


function connMysql() {

    let conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log('[db err]', err);
            setTimeout(connMysql, 200);
        }else {
            console.log('DB Conectada!!')
        }
    });

    return conexion
}

function closeConnection(conexion) {
    if (conexion) {
        conexion.end((err) => {
            if (err) {
                console.log('[db err] Error cerrando la conexión:', err);
            } else {
                console.log('Conexión cerrada correctamente.');
            }
        });
    } else {
        console.log('No hay ninguna conexión activa.');
    }
}



function fullTable(table) {
    let conexion = connMysql();
    return new Promise((resolve, reject) => {
        
        conexion.query(`SELECT * FROM ${table}`, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    }).finally(() => {
        closeConnection(conexion);
    });
}

module.exports = {
    fullTable,
    connMysql,
    closeConnection
}