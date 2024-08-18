const expreess = require('express');

const router = expreess.Router();

router.get('/', function (req, res) {
    res.send('Ranking OK')
});

module.exports = router;