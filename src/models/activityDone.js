const { conexion, fullTable } = require('../DB/mysql.js');

const table = 'ACTIVITY_DONE'

function getAllActivitiesDone() {
    return fullTable(table);
}

function getActivityDone(autor, juez, rankID, actID){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT * FROM ?? WHERE autor = ? AND juez = ? AND rankID = ? AND actID = ?', [table, autor, juez, rankID, actID], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function addActivityDone(id, name, description, score) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO ACTIVITY_DONE (autor, juez, rankID, actID) VALUES (?, ?, ?, ?, ?, ?)';
        
        conexion.query(query, [fecha, count, autor, juez, rankID, actID], (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return reject({
                        status: 400,
                        message: 'id'
                    });
                } else {
                    return reject({
                        status: 404,
                        message: 'Error'
                    });
                }
            }
            resolve({
                fecha: fecha,
                count: count,
                autor: autor,
                juez: juez,
                rankID : rankID,
                actID: actID
            });
        });
    });
}

module.exports = {
    getAllActivitiesDone,
    getActivityDone,
    addActivityDone
}