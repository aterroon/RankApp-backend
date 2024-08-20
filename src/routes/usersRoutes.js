const express = require('express')
const { getAllUsers, getUser, addUser } = require('../models/users');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:nickname', async (req, res) => {
    try {
        const nickname = req.params.nickname;
        const user = await getUser(nickname);

        if (user.length === 0) { 
            return res.status(404).json({'message':'User not found'});
        }

        res.json(user[0]);
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

