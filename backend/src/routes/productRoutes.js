const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, controller.findAll);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.create);
router.put('/:id/closing-stock', authMiddleware.verifyToken, controller.updateClosingStock);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.updateProduct);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, controller.deleteProduct);

module.exports = router;
