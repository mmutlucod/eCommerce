const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');
const ProductComment = require('../models/productComment');
const Product = require('../models/product');
const sellerProduct = require('../models/sellerProduct');
const productQuestion = require('../models/productQuestion');
const upload = require('../upload'); // upload.js dosyasını içe aktarın

router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/listAdmins', authMiddleware, roleCheckMiddleware('admin'), adminController.listAdmins);

router.get('/products', authMiddleware, roleCheckMiddleware('admin'), adminController.getProducts)
router.get('/products/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getProductsById);
router.post('/create-product', authMiddleware, roleCheckMiddleware('admin'), upload.array('files', 10), adminController.createProduct);
router.put('/products/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.editProduct);
router.delete('/products/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.deleteProduct);
router.get('/searchProduct', authMiddleware, roleCheckMiddleware('admin'), adminController.searchProduct);

router.get('/categories', authMiddleware, roleCheckMiddleware('admin'), adminController.getCategories)
router.get('/categories/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getCategoriesById);
router.post('/create-category', authMiddleware, roleCheckMiddleware('admin'), adminController.createCategory);
router.put('/categories/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.editCategory);
router.delete('/categories/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.deleteCategory);

router.get('/users', authMiddleware, roleCheckMiddleware('admin'), adminController.getUsers);
router.get('/users/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getUsersById);
router.post('/create-user', authMiddleware, roleCheckMiddleware('admin'), adminController.createUser);
router.put('/users/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.editUser);
router.delete('/users/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.deleteUser);

// router.get('/moderators', authMiddleware, adminController.getModerators)
// router.get('/moderators/:id', authMiddleware, adminController.getModeratorsById);
// router.post('/create-moderator', authMiddleware, adminController.createModerator);
// router.put('/moderators/:id', authMiddleware, adminController.editModerator);
// router.delete('/moderators/:id', authMiddleware, adminController.deleteModerator);

router.get('/orders', authMiddleware, roleCheckMiddleware('admin'), adminController.getOrders);
router.get('/orders/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getOrderDetailsById);
router.put('/orders/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.updateOrder);

router.get('/sellers', authMiddleware, roleCheckMiddleware('admin'), adminController.getSellers);
router.get('/sellers/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getSellerById);
router.post('/create-seller', authMiddleware, roleCheckMiddleware('admin'), adminController.createSeller);
router.put('/sellers/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.editSeller);
router.delete('/sellers/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.deleteSeller);

router.get('/brands', authMiddleware, roleCheckMiddleware('admin'), adminController.getBrands);
router.get('/brands/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.getBrandById);
router.post('/create-brand', authMiddleware, roleCheckMiddleware('admin'), adminController.createBrand);
router.put('/brands/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.editBrand);
router.delete('/brands/:id', authMiddleware, roleCheckMiddleware('admin'), adminController.deleteBrand);

router.get('/approvalstatuses', adminController.getApprovalStatuses);
router.get('/approvalstatuses/:id', adminController.getApprovalStatusById);


// Ürün onayı
router.put('/approve/product/:id/:approval_status_id', authMiddleware, roleCheckMiddleware('admin'), async (req, res) => {
    await adminController.updateApprovalStatus(Product, 'product_id', req, res);
});

// Yorum onayı
router.put('/approve/comment/:id/:approval_status_id', authMiddleware, roleCheckMiddleware('admin'), async (req, res) => {
    await adminController.updateApprovalStatus(ProductComment, 'comment_id', req, res);
});

// Satıcı ürün onayı
router.put('/approve/seller-product/:id/:approval_status_id', authMiddleware, roleCheckMiddleware('admin'), async (req, res) => {
    await adminController.updateApprovalStatus(sellerProduct, 'seller_product_id', req, res);
});

// Soru cevap onayı
router.put('/approve/question/:id/:approval_status_id', authMiddleware, roleCheckMiddleware('admin'), async (req, res) => {
    await adminController.updateApprovalStatus(productQuestion, 'question_id', req, res);
});


router.get('/getProducts', authMiddleware, roleCheckMiddleware('admin'), adminController.getProducts);
router.get('/getSellerProducts', authMiddleware, roleCheckMiddleware('admin'), adminController.getSellerProducts);
router.get('/getProductComments', authMiddleware, roleCheckMiddleware('admin'), adminController.getProductComments);
router.get('/getProductQuestions', authMiddleware, roleCheckMiddleware('admin'), adminController.getProductQuestions);


module.exports = router;