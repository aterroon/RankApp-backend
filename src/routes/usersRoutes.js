const express = require('express')
const { getAllUsers, addUser } = require('../models/users');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { nickname } = req.body;
        const newUser = await addUser(nickname);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message }); // Responder con el código 400 y mensaje adecuado
    }
});

module.exports = router

