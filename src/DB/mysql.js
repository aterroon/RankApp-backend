const mysql = require('mysql')
require('dotenv').config();

const dbconfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
}

const prueba = {
    id : 1,
    nombre: 'santi',
    puntos : 100
}


let conexion; 

function connMysql() {

    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log('[db err]', err);
            setTimeout(connMysql, 200);
        }else {
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

//connMysql();


function todos(tabla) {
    return prueba;
    /*
    return new Promise( (resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
    */
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
    connMysql
}