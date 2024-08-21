const express = require('express')
const { getAllRanking, getRanking, addRanking } = require('../models/ranking');
const { getUsers, addUserRanking } = require('../models/rankingScore');
const { formatDateForSQL } = require('../utils/utils');
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
        const users = await getUsers(id);

        if (ranking.length === 0) { 
            return res.status(404).json({'message':'Ranking not found'});
        }

        const rankingData = ranking[0];
    
        rankingData.users = users;
        rankingData.fechaIni = formatDateForSQL(rankingData.fechaIni)
        rankingData.fechaFin = formatDateForSQL(rankingData.fechaFin)
        res.json(rankingData);

    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const { name, fechaIni, fechaFin, description, reward, nickname } = req.body;
        const newRanking = await addRanking( name, fechaIni, fechaFin, description, reward, nickname);
        await addUserRanking( nickname, newRanking.id);
        res.status(201).json(newRanking);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

router.post('/:id/users/:nickname', async (req, res) => {
    try {
        const id = req.params.id
        const { nickname } = req.body;
        await addUserRanking( nickname, id);
        const newListUsers = await getUsers(id);
        res.status(201).json(newListUsers);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

module.exports = router

