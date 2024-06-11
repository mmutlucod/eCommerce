const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const adminController = require('../controllers/adminController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');
const { route } = require('./admin');
const Seller = require('../models/seller');
const sellerProduct = require('../models/sellerProduct');
const upload = require('../upload'); // upload.js dosyasını içe aktarın

router.post('/login', sellerController.login);
router.post('/register', sellerController.register);
router.get('/listSellers', authMiddleware, sellerController.listSellers);

router.get('/products', authMiddleware, roleCheckMiddleware('seller'), sellerController.getSellerProducts);
router.get('/products/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.getSellerProductDetailsById);
router.get('/searchSellerProducts', authMiddleware, roleCheckMiddleware('seller'), sellerController.searchSellerProducts);
router.get('/searchAllProducts', authMiddleware, roleCheckMiddleware('seller'), sellerController.searchAllProducts);
router.post('/create-product', authMiddleware, roleCheckMiddleware('seller'), upload.array('files', 10), sellerController.createProduct);
router.post('/create-seller-product', authMiddleware, roleCheckMiddleware('seller'), sellerController.createSellerProduct);
router.put('/products/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.updateSellerProduct);
router.put('/activateProduct/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.activateSellerProduct);
router.put('/deactivateProduct/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.deactivateSellerProduct);

router.get('/allBrands', authMiddleware, roleCheckMiddleware('seller'), sellerController.getAllBrands);
router.get('/brands', authMiddleware, roleCheckMiddleware('seller'), sellerController.getSellerBrands);
router.get('/searchAllBrands', authMiddleware, roleCheckMiddleware('seller'), sellerController.searchAllBrands);
router.get('/searchSellerBrands', authMiddleware, roleCheckMiddleware('seller'), sellerController.searchSellerBrands);
router.post('/create-seller-brand', authMiddleware, roleCheckMiddleware('seller'), sellerController.createBrand);
router.put('/brands/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.updateBrand);

router.get('/categories', authMiddleware, roleCheckMiddleware('seller'), sellerController.getAllCategories);
router.get('/searchCategories', authMiddleware, roleCheckMiddleware('seller'), sellerController.getAllCategoriesWithSearch);
router.patch('/update-order-status/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.updateOrderStatus);
router.get('/seller-orders', authMiddleware, roleCheckMiddleware('seller'), sellerController.getSellerOrders);
router.get('/orders/:orderStatusId', authMiddleware, roleCheckMiddleware('seller'), sellerController.getSellerOrdersByStatusId);
router.post('/update-shipping-code/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.updateShippingCodeOrderItem);
router.post('/complete-order/:id', authMiddleware, roleCheckMiddleware('seller'), sellerController.updateOrderStatus);
router.post('/cancel-order-item', authMiddleware, roleCheckMiddleware('seller'), sellerController.cancelOrderItemQuantity);

router.get('/my-questions', authMiddleware, roleCheckMiddleware('seller'), sellerController.getQuestions);
router.patch('/my-questions/:questionId', authMiddleware, roleCheckMiddleware('seller'), sellerController.answerQuestion);

router.get('/comments', authMiddleware, roleCheckMiddleware('seller'), sellerController.getComments);
router.get('/comments/:sellerProductId', authMiddleware, roleCheckMiddleware('seller'), sellerController.getCommentsById);



module.exports = router;