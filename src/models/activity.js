const { conexion, fullTable } = require('../DB/mysql.js');

const table = 'ACTIVITY'

function getAllActivities() {
    return fullTable(table);
}

function getActivity(id){
    return new Promise( (resolve, reject) => {
        conexion.query('SELECT * FROM ?? WHERE id = ?', [table, id], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        })
    });
}

function addActivity(id, name, description, score) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO ACTIVITY (id) VALUES (?, ?, ?, ?)';
        
        conexion.query(query, [id, name, description, score], (error, results) => {
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
                id: id,
                name: name,
                description: description,
                score: score
            });
        });
    });
}

module.exports = {
    getAllActivities,
    getActivity,
    addActivity
}