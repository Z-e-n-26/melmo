const express = require('express');
const router = express.Router();
const controller = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, controller.addStockMovement);
router.get('/history', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.getWeeklyHistory);
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.getStockMovements);

module.exports = router;
