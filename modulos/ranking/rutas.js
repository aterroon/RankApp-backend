const expreess = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = expreess.Router();

router.get('/', function (req, res) {
    const todos = controlador.todos();
    respuesta.success(req, res, todos, 200)
});

module.exports = router;