const { conexion, fullTable } = require('../DB/mysql.js');
const {formatDateForSQL} = require('../utils/utils.js')
const table = 'RANKING'

function getAllRanking() {
    return fullTable(table);
}

function getRanking(id){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT * FROM ?? WHERE id = ?', [table, id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function addRanking(name, fechaIni, fechaFin,description, reward, nickname) {
    return new Promise((resolve, reject) => {
        const formattedFechaIni = formatDateForSQL(fechaIni);
        const formattedFechaFin = formatDateForSQL(fechaFin);
        
        const query = 'INSERT INTO RANKING (name, fechaIni, fechaFin, description, reward) VALUES (?,?,?,?,?)';
        
        conexion.query(query, [name, formattedFechaIni, formattedFechaFin, description, reward], (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject({
                        status: 400,
                        message: 'Error'
                    });
                }
            }
            resolve({
                id: results.insertId,
                name: name, 
                description: description, 
                fechaIni: fechaIni, 
                fechaFin: fechaFin,
                reward: reward,
                nickname: nickname
            });
        });
    });
}

module.exports = {
    getAllRanking,
    getRanking,
    addRanking
}