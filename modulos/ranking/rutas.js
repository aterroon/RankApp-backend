const expreess = require('express');

const respuesta = require('../../red/respuestas');

const router = expreess.Router();

router.get('/', function (req, res) {
    //res.send('Ranking OK')
    respuesta.success(req, res, 'Santi mamapinga llegas tarde', 200)
});

module.exports = router;