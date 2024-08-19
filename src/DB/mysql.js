const mysql = require('mysql')
const config = require('../config')

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

/*
let conexion;

function connMysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log('[db err]', err);
            setTimeout(connMysql, 200);
        } else {
            console.log('DB Conectada!!')
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            connMysql();
        } else {
            throw err;
        }
    })
}
connMysql();
*/

function todos(tabla) {
    return 'Todo Ok desde ranking';
}

function uno(tabla, id) {

}

function anadir(tabla, data) {

}

function eliminar(tabla, id) {

}

module.exports = {
    todos,
    uno,
    anadir,
    eliminar,
}