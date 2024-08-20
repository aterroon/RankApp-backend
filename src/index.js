const mysql = require('./DB/mysql');
const express = require('express');
require('dotenv').config();

const ranking = require('./modulos/ranking/rutas')

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto", port);
});

//rutas 
app.use('/api/ranking', ranking)