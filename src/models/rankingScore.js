const { conexion, fullTable } = require('../DB/mysql.js');

const table = 'RANKING_SCORE'

function getAllUsersScores() {
    return fullTable(table);
}

function getRankings(nickname){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT ranking_id, score FROM ?? WHERE usuario_nickname = ?', [table, nickname], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function getUsers(id){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT usuario_nickname, score FROM ?? WHERE ranking_id = ?', [table, id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function addUserRanking(nickname, id) {
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
    });
}

module.exports = {
    getAllUsersScores,
    getUsers,
    getRankings,
    addUserRanking
}