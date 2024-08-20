const db = require('../../DB/mysql');

const TABLA = 'USUARIO';

function todos() {
    return db.todos(TABLA);
}

module.exports = {
    todos,
}