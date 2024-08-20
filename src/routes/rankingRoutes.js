const express = require('express')
const { getAllRanking, getRanking, addRanking } = require('../models/ranking');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const rankings = await getAllRanking();
        res.json(rankings);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const ranking = await getRanking(id);

        if (ranking.length === 0) { 
            return res.status(404).json({'message':'Ranking not found'});
        }

        res.json(ranking[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/', async (req, res) => {
    try {
        const { name, fechaIni, fechaFin, description, reward, nickname } = req.body;
        const newRanking = await addRanking( name, fechaIni, fechaFin, description, reward, nickname);
        res.status(201).json(newRanking);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

module.exports = router

