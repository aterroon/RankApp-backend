const express = require('express')
const { getAllActivities, getActivity, addActivity } = require('../models/activity');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const activities = await getAllActivities();
        res.json(activities);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const activity = await getActivity(id);

        if (activity.length === 0) { 
            return res.status(404).json({'message':'Activity not found'});
        }

        res.json(activity[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, name, description, score } = req.body;
        const newActivity = await addActivity(id, name, description, score);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); // Responder con el código 400 y mensaje adecuado
    }
});

module.exports = router

