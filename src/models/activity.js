const { connMysql, closeConnection, fullTable } = require('../DB/mysql.js');

const table = 'ACTIVITY'


function getAllActivities() {
    return fullTable(table);
}

function getActivity(id){
    let conexion = connMysql();    
    return new Promise( (resolve, reject) => {
        conexion.query(
            'SELECT * FROM ACTIVITY A WHERE A.id = ?',
            [id], 
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    }).finally(() => {
        closeConnection(conexion);
    });
}

function getActivitiesRanking(id){
    let conexion = connMysql();    
    return new Promise( (resolve, reject) => {
        conexion.query(
            'SELECT A.id, A.name, A.description, A.score FROM ACTIVITY A JOIN ACTIVITY_OPTION AO ON A.id = AO.id_activity WHERE AO.id_ranking = ?',
            [id], 
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    }).finally(() => {
        closeConnection(conexion);
    });
}

async function addActivity(name, description, score, id_rank) {
    try {
        const query1 = 'SELECT *  FROM RANKING WHERE id = ?';
        let conexion1 = connMysql();        
        const rows = await new Promise((resolve, reject) => {
            conexion1.query(query1, [id_rank], (error, results) => {
                if (error) {
                    return reject({
                        status: 500,
                        message: 'Error al verificar el id_rank: ' + error.message
                    });
                }
                resolve(results);
            });
        }).finally(() => {
            closeConnection(conexion1);
        });
        if (rows.length === 0) {
            return {
                status: 404,
                message: 'Ranking not found'
            };
        }

        const query2 = 'INSERT INTO ACTIVITY (name, description, score) VALUES (?, ?, ?)';
        let conexion2 = connMysql();        
        const activityResult = await new Promise((resolve, reject) => {
            conexion2.query(query2, [name, description, score], (error, results) => {
                if (error) {
                    return reject({
                        status: 500,
                        message: 'Error al insertar en ACTIVITY: ' + error.message
                    });
                }
                resolve(results);
            });
        }).finally(() => {
            closeConnection(conexion2);
        });

        const activityId = activityResult.insertId;

        const query3 = 'INSERT INTO ACTIVITY_OPTION (id_activity, id_ranking) VALUES (?, ?)';
        let conexion3 = connMysql();        
        await new Promise((resolve, reject) => {
            conexion3.query(query3, [activityId, id_rank], (error, results) => {
                if (error) {
                    return reject({
                        status: 500,
                        message: 'Error al insertar en ACTIVITY_OPTION: ' + error.message
                    });
                }
                resolve(results);
            });
        }).finally(() => {
            closeConnection(conexion3);
        });

        return {
            id: activityId,
            name: name,
            description: description,
            score: score
        };

    } catch (error) {
        console.error('Error al agregar la actividad:', error);
        return error;
    }
}


module.exports = {
    getAllActivities,
    getActivitiesRanking,
    getActivity,
    addActivity
}