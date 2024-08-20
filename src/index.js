const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT;
const users = require('./routes/usersRoutes')
const rankings = require('./routes/rankingRoutes')



app.listen(port, () => {
    console.log("Servidor escuchando en el puerto", port);
});

//path
app.use(express.json());
app.use('/api/users', users)
app.use('/api/rankings', rankings)