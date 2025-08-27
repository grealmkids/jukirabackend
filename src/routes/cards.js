const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cards');

router.post('/generate', cardsController.generateCard);

module.exports = router;
