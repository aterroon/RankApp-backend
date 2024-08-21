const express = require('express')
const { getAllActivities, getActivitiesRanking, addActivity } = require('../models/activity');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();
        res.json(activities);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/rankings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const activity = await getActivitiesRanking(id);

        res.json(activity);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const {name, description, score, id_rank } = req.body;
        const newActivity = await addActivity(name, description, score, id_rank);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

module.exports = router

