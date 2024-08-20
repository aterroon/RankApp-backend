const { conexion, fullTable } = require('../DB/mysql.js');

const table = 'USUARIO'

function getAllUsers() {
    return fullTable(table);
}

function getUser(nickname){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT * FROM ?? WHERE nickname = ?', [table, nickname], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function addUser(nickname) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO USUARIO (nickname) VALUES (?)';
        
        conexion.query(query, [nickname], (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject({
                        status: 400,
                        message: 'nickname'
                    });
                } else {
                    return reject({
                        status: 404,
                        message: 'Error'
                    });
                }
            }
            resolve({
                nickname: nickname
            });
        });
    });
}

module.exports = {
    getAllUsers,
    getUser,
    addUser
}