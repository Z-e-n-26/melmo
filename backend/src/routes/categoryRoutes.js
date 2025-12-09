const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, controller.findAll);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.create);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.delete);

module.exports = router;
