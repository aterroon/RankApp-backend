const e = require('express');
const { conexion, fullTable } = require('../DB/mysql.js');

const table = 'ACTIVITY_DONE'

function getAllActivitiesDone() {
    return fullTable(table);
}

async function getActivityDone(autor, rankID, score) {
    try {
        const query1 = 'SELECT id_activity, fecha, juez FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ?';
        const activitiesDone = await new Promise((resolve, reject) => {
            conexion.query(query1, [autor, rankID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (activitiesDone.length === 0) {
            return { nickname: autor, score: score, activities: [] };
        }

    
        const activitiesDetails = await Promise.all(activitiesDone.map(async activity => {
            const query2 = 'SELECT id, name, description, score FROM ACTIVITY WHERE id = ?';
            const [activityDetail] = await new Promise((resolve, reject) => {
                conexion.query(query2, [activity.id_activity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });

            return {
                id: activityDetail.id,
                name: activityDetail.name,
                description: activityDetail.description,
                score: activityDetail.score,
                fecha: activity.fecha,
                assigned_by: activity.juez
            };
        }));

        return {
            nickname: autor,
            score: score,
            activities: activitiesDetails
        };

    } catch (error) {
        console.error('Error fetching activity data:', error);
        throw error;
    }
}


async function addActivityDone(autor, idRanking, idActivity, juez, fecha) {
    try {
        const query1 = 'SELECT *  FROM ACTIVITY_DONE WHERE id_ranking = ? AND id_activity = ? AND autor = ?';
        const rows = await new Promise((resolve, reject) => {
            conexion.query(query1, [idRanking, idActivity, autor], (error, results) => {
                if (error) {
                    return reject({
                        status: 500,
                        message: 'Error al verificar el id_rank: ' + error.message
                    });
                }
                resolve(results);
            });
        });
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO ACTIVITY_DONE (id_ranking, id_activity, fecha, count, autor, juez) VALUES (?, ?, ?, ?, ?, ?)';
        await conexion.query(insertQuery, [idRanking, idActivity, fecha, 1, autor, juez]);

        return { autor };
        }
        else{
            const updateQuery = 'UPDATE ACTIVITY_DONE SET count = count + 1 WHERE id_ranking = ? AND id_activity = ? AND autor = ?';
                await conexion.query(updateQuery, [idRanking, idActivity, autor]);
                return { autor };
        }
        

    } catch (error) {
        console.log(error)
    }
}

async function deleteActivityDone(autor, idRanking, idActivity) {
    try {
        const querySelect = 'SELECT count FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
        const [activity] = await new Promise((resolve, reject) => {
            conexion.query(querySelect, [autor, idRanking, idActivity], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (!activity) {
            return {
                status: 404,
                message: 'No se encontró la actividad para eliminar.'
            };
        }

        if (activity.count === 1) {
            const queryDelete = 'DELETE FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
            const result = await new Promise((resolve, reject) => {
                conexion.query(queryDelete, [autor, idRanking, idActivity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            return {
                status: 200,
                message: 'Actividad eliminada exitosamente.'
            };

        } else {
            const queryUpdate = 'UPDATE ACTIVITY_DONE SET count = count - 1 WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
            const result = await new Promise((resolve, reject) => {
                conexion.query(queryUpdate, [autor, idRanking, idActivity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            return {
                status: 200,
                message: 'Actividad actualizada exitosamente.'
            };
        }

    } catch (error) {
        console.error('Error al manejar la actividad:', error);
        return {
            status: 500,
            message: 'Error al manejar la actividad.'
        };
    }
}


module.exports = {
    getAllActivitiesDone,
    getActivityDone,
    addActivityDone,
    deleteActivityDone
}