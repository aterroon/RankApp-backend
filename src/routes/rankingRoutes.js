const express = require('express')
const { getAllRanking, getRanking, addRanking } = require('../models/ranking');
const { getUsers, addUserRanking, updateUserRanking, getUserScore } = require('../models/rankingScore');
const { formatDateForSQL } = require('../utils/utils');
const { addActivityDone, getActivityDone, deleteActivityDone } = require('../models/activityDone');
const { getActivity } = require('../models/activity');
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

router.get('/:id/users/:nickname/activities', async (req, res) => {
    try {
        const id_ranking = req.params.id
        const autor = req.params.nickname
        const result = await getUserScore(autor, id_ranking);
        const score = result[0].score; 
        const objActAutorRank = await getActivityDone(autor, id_ranking, score)
        res.status(201).json(objActAutorRank);

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

router.post('/:id/users/:nickname/activities', async (req, res) => {
    try {
        const id_ranking = req.params.id
        const autor = req.params.nickname
        const { id_activity, nickname_juez, fecha } = req.body;
        const newActi = await addActivityDone( autor, id_ranking, id_activity, nickname_juez, fecha);
        const activity = await getActivity(id_activity);
        const result = await updateUserRanking(autor,id_ranking,activity[0].score)
        const score = result[0].score; 
        const objActAutorRank = await getActivityDone(autor, id_ranking, score)
        res.status(201).json(objActAutorRank);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

router.delete('/:id/users/:nickname/activities/:id_activity', async (req, res) => {
    try {
        const id_ranking = req.params.id
        const id_activity= req.params.id_activity
        const autor = req.params.nickname

        await deleteActivityDone( autor, id_ranking, id_activity);
        const activity = await getActivity(id_activity);
        const resta = -activity[0].score;
        const result = await updateUserRanking(autor,id_ranking, resta)
        const score = result[0].score;
        const objActAutorRank = await getActivityDone(autor, id_ranking, score)
        res.status(201).json(objActAutorRank);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); 
    }
});

module.exports = router

