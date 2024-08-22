const e = require('express');
const { connMysql, closeConnection, fullTable } = require('../DB/mysql.js');

const table = 'ACTIVITY_DONE'

function getAllActivitiesDone() {
    return fullTable(table);
}

async function getActivityDone(autor, rankID, score) {
    try {
        const query1 = 'SELECT id_activity, fecha, juez FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ?';
        let conexion = connMysql();
        const activitiesDone = await new Promise((resolve, reject) => {
            conexion.query(query1, [autor, rankID], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        }).finally(() => {
            closeConnection(conexion);
        });

        if (activitiesDone.length === 0) {
            return { nickname: autor, score: score, activities: [] };
        }

    
        const activitiesDetails = await Promise.all(activitiesDone.map(async activity => {
            const query2 = 'SELECT id, name, description, score FROM ACTIVITY WHERE id = ?';
            let conexion = connMysql();
            const [activityDetail] = await new Promise((resolve, reject) => {
                conexion.query(query2, [activity.id_activity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            }).finally(() => {
                closeConnection(conexion);
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
    let conexion; // Declaramos la variable fuera del bloque try para poder cerrarla en finally
    try {
        conexion = connMysql(); // Conexión única

        // Verificar si la actividad ya ha sido realizada
        const query1 = 'SELECT * FROM ACTIVITY_DONE WHERE id_ranking = ? AND id_activity = ? AND autor = ?';
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

        // Si la actividad no existe, la insertamos
        if (rows.length === 0) {
            const insertQuery = 'INSERT INTO ACTIVITY_DONE (id_ranking, id_activity, fecha, count, autor, juez) VALUES (?, ?, ?, ?, ?, ?)';
            await new Promise((resolve, reject) => {
                conexion.query(insertQuery, [idRanking, idActivity, fecha, 1, autor, juez], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });

            return { autor };
        } else {
            // Si la actividad ya existe, actualizamos el conteo
            const updateQuery = 'UPDATE ACTIVITY_DONE SET count = count + 1 WHERE id_ranking = ? AND id_activity = ? AND autor = ?';
            await new Promise((resolve, reject) => {
                conexion.query(updateQuery, [idRanking, idActivity, autor], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });

            return { autor };
        }
    } catch (error) {
        console.error(error);
        throw error; // Re-lanzar el error para que pueda ser manejado por el llamador de la función
    } finally {
        if (conexion) closeConnection(conexion); // Cerramos la conexión en el finally
    }
}


async function deleteActivityDone(autor, idRanking, idActivity) {
    try {
        const querySelect = 'SELECT count FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
        let conexion = connMysql()
        const [activity] = await new Promise((resolve, reject) => {
            conexion.query(querySelect, [autor, idRanking, idActivity], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        }).finally(() => {
            closeConnection(conexion);
        });

        if (!activity) {
            return {
                status: 404,
                message: 'No se encontró la actividad para eliminar.'
            };
        }

        if (activity.count === 1) {
            const queryDelete = 'DELETE FROM ACTIVITY_DONE WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
            let conexion = connMysql();
            const result = await new Promise((resolve, reject) => {
                conexion.query(queryDelete, [autor, idRanking, idActivity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            }).finally(() => {
                closeConnection(conexion);
            });
            return {
                status: 200,
                message: 'Actividad eliminada exitosamente.'
            };

        } else {
            const queryUpdate = 'UPDATE ACTIVITY_DONE SET count = count - 1 WHERE autor = ? AND id_ranking = ? AND id_activity = ?';
            let conexion = connMysql();
            const result = await new Promise((resolve, reject) => {
                conexion.query(queryUpdate, [autor, idRanking, idActivity], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            }).finally(() => {
                closeConnection(conexion);
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