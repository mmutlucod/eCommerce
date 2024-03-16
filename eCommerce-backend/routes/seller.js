const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const adminController = require('../controllers/adminController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');
const { route } = require('./admin');
const Seller = require('../models/seller');
const sellerProduct = require('../models/sellerProduct');

router.post('/login', sellerController.login);
router.post('/register', sellerController.register);
router.get('/listSellers', sellerController.listSellers);

router.get('/products', authMiddleware, sellerController.getProducts);
router.get('/products/:id', authMiddleware, sellerController.getProductDetailsById);
router.post('/create-seller-product', authMiddleware, sellerController.createProduct);
router.put('/products/:id', authMiddleware, sellerController.updateProduct);
router.put('/activateProduct/:id', authMiddleware, sellerController.activateProduct);
router.put('/deactivateProduct/:id', authMiddleware, sellerController.deactivateProduct);

module.exports = router;