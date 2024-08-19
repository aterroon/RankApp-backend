const db = require('../../DB/mysql');

const TABLA = 'ranking';

function todos() {
    return db.todos(TABLA);
}

module.exports = {
    todos,
}