const express = require('express');
const router = express.Router();
const birthdaysController = require('../controllers/birthdays');

router.post('/', birthdaysController.addBirthday);
router.get('/:id', birthdaysController.getBirthdayById);

module.exports = router;
