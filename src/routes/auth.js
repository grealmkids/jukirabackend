
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.me);
router.get('/birthdays', authController.getBirthdays);

module.exports = router;
