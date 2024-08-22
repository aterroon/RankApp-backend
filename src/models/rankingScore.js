const { connMysql, closeConnection, fullTable } = require('../DB/mysql.js');

const table = 'RANKING_SCORE'


function getAllUsersScores() {
    return fullTable(table);
}

function getUserScore(nickname, id_ranking){
    let conexion = connMysql();
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT score FROM ?? WHERE ranking_id = ? AND usuario_nickname = ?', [table, id_ranking, nickname], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    }).finally(() => {
        closeConnection(conexion);
    });
}

function getRankings(nickname) {
    let conexion = connMysql();
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ur.ranking_id, ur.score, r.name 
            FROM RANKING_SCORE ur
            JOIN RANKING r ON ur.ranking_id = r.id
            WHERE ur.usuario_nickname = ?
        `;
        conexion.query(query, [nickname], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    }).finally(() => {
        closeConnection(conexion);
    });
}


function getUsers(id){
    let conexion = connMysql();
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT usuario_nickname, score FROM ?? WHERE ranking_id = ?', [table, id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    }).finally(() => {
        closeConnection(conexion);
    });
}

function addUserRanking(nickname, id) {
    let conexion = connMysql();
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO RANKING_SCORE (score, usuario_nickname, ranking_id) VALUES (?,?,?)';
        conexion.query(query, [0,nickname,id], (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject({
                        status: 400,
                        message: 'nickname not found'
                    });
                } else {
                    return reject({
                        status: 404,
                        message: 'nickname not found'
                    });
                }
            }
            resolve(getUsers(id));
        });
    }).finally(() => {
        closeConnection(conexion);
    });
}

function updateUserRanking(nickname, id, score) {
    let conexion = connMysql();
    return new Promise((resolve, reject) => {
        const query = 'UPDATE RANKING_SCORE SET score = score + ?  WHERE usuario_nickname = ? AND ranking_id = ?';
        conexion.query(query, [score,nickname,id], (error, results) => {
            if (error) {
                if (error)  {
                    return reject({
                        status: 404,
                        message: 'nickname or ranking id not found'
                    });
                }
            }
            resolve(getUserScore(nickname, id));
        });
    }).finally(() => {
        closeConnection(conexion);
    });
}

module.exports = {
    getAllUsersScores,
    getUserScore,
    getUsers,
    getRankings,
    addUserRanking,
    updateUserRanking
}