const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.post('/signin', controller.signin);
router.post('/register', controller.register); // Optional

module.exports = router;
