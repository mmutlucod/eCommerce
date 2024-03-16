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
router.get('/products/:id', sellerController.getProductDetailsById);

module.exports = router;