const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users-controller'); 

router.post('/register', UsersController.registerUser);

router.post('/login', UsersController.Login);

module.exports = router;