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
router.put('/activateProduct/:id', sellerController.activateProduct);
router.put('/deactivateProduct/:id', sellerController.deactivateProduct);

router.get('/allBrands', authMiddleware, sellerController.getAllBrands);
router.get('/brands', authMiddleware, sellerController.getSellerBrands);
router.get('/searchBrands', sellerController.searchBrand);
router.post('/create-seller-brand', authMiddleware, sellerController.createBrand);
router.put('/brands/:id', authMiddleware, sellerController.updateBrand);


router.get('/categories', authMiddleware, sellerController.getAllCategories);
router.get('/searchCategories', sellerController.getAllCategoriesWithSearch);
router.patch('/update-order-status/:id', sellerController.updateOrderStatus);
router.get('/orders', authMiddleware, sellerController.getSellerOrders);
router.post('/update-shipping-code/:id', sellerController.updateShippingCodeOrderItem);
router.post('/cancel-order-item', sellerController.cancelOrderItemQuantity);


module.exports = router;