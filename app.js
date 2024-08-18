const express = require('express');
const config = require('./config');

const ranking = require('./modulos/ranking/rutas')

const app = express();

//config
app.set('port', config.app.port)

//rutas 
app.use('/api/ranking', ranking)

module.exports = app;