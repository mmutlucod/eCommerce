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
router.get('/listSellers', authMiddleware, sellerController.listSellers);

router.get('/products', authMiddleware, sellerController.getSellerProducts);
router.get('/products/:id', authMiddleware, sellerController.getSellerProductDetailsById);
router.get('/searchSellerProducts', authMiddleware, sellerController.searchSellerProducts);
router.get('/searchAllProducts', authMiddleware, sellerController.searchAllProducts);
router.post('/create-product', authMiddleware, sellerController.createProduct);
router.post('/create-seller-product', authMiddleware, sellerController.createSellerProduct);
router.put('/products/:id', authMiddleware, sellerController.updateSellerProduct);
router.put('/activateProduct/:id', authMiddleware, sellerController.activateSellerProduct);
router.put('/deactivateProduct/:id', authMiddleware, sellerController.deactivateSellerProduct);

router.get('/allBrands', authMiddleware, sellerController.getAllBrands);
router.get('/brands', authMiddleware, sellerController.getSellerBrands);
router.get('/searchAllBrands', authMiddleware, sellerController.searchAllBrands);
router.get('/searchSellerBrands', authMiddleware, sellerController.searchSellerBrands);
router.post('/create-seller-brand', authMiddleware, sellerController.createBrand);
router.put('/brands/:id', authMiddleware, sellerController.updateBrand);

router.get('/categories', authMiddleware, sellerController.getAllCategories);
router.get('/searchCategories', authMiddleware, sellerController.getAllCategoriesWithSearch);
router.patch('/update-order-status/:id', authMiddleware, sellerController.updateOrderStatus);
router.get('/seller-orders', authMiddleware, sellerController.getSellerOrders);
router.get('/orders/:orderStatusId', authMiddleware, sellerController.getSellerOrdersByStatusId);
router.post('/update-shipping-code/:id', authMiddleware, sellerController.updateShippingCodeOrderItem);
router.post('/complete-order/:id', authMiddleware, sellerController.updateOrderStatus);
router.post('/cancel-order-item', authMiddleware, sellerController.cancelOrderItemQuantity);

router.get('/my-questions', authMiddleware, sellerController.getQuestions);
router.patch('/my-questions/:questionId', authMiddleware, sellerController.answerQuestion);

router.get('/comments', authMiddleware, sellerController.getComments);
router.get('/comments/:sellerProductId', authMiddleware, sellerController.getCommentsById);



module.exports = router;