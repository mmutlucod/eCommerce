const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');


router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/listAdmins', authMiddleware, roleCheckMiddleware('admin'), adminController.listAdmins);

router.get('/products', authMiddleware, adminController.getProducts)
router.get('/products/:id', authMiddleware, adminController.getProductsById);
router.post('/create-product', authMiddleware, adminController.createProduct);
router.put('/products/:id', authMiddleware, adminController.editProduct);
router.delete('/products/:id', authMiddleware, adminController.deleteProduct);
router.get('/searchProduct', authMiddleware, adminController.searchProduct);

router.get('/categories', adminController.getCategories)
router.get('/categories/:id', authMiddleware, adminController.getCategoriesById);
router.post('/create-category', adminController.createCategory);
router.put('/categories/:id', adminController.editCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/users', authMiddleware, adminController.getUsers);
router.get('/users/:id', authMiddleware, adminController.getUsersById);
router.post('/create-user', authMiddleware, adminController.createUser);
router.put('/users/:id', authMiddleware, adminController.editUser);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

// router.get('/moderators', authMiddleware, adminController.getModerators)
// router.get('/moderators/:id', authMiddleware, adminController.getModeratorsById);
// router.post('/create-moderator', authMiddleware, adminController.createModerator);
// router.put('/moderators/:id', authMiddleware, adminController.editModerator);
// router.delete('/moderators/:id', authMiddleware, adminController.deleteModerator);

router.get('/orders', authMiddleware, adminController.getOrders);
router.get('/orders/:id', authMiddleware, adminController.getOrderDetailsById);
router.put('/orders/:id', authMiddleware, adminController.updateOrder);

router.get('/sellers', authMiddleware, adminController.getSellers);
router.get('/sellers/:id', authMiddleware, adminController.getSellerById);
router.post('/create-seller', authMiddleware, adminController.createSeller);
router.put('/sellers/:id', authMiddleware, adminController.editSeller);
router.delete('/sellers/:id', authMiddleware, adminController.deleteSeller);

router.get('/brands', authMiddleware, adminController.getBrands);
router.get('/brands/:id', authMiddleware, adminController.getBrandById);
router.post('/create-brand', authMiddleware, adminController.createBrand);
router.put('/brands/:id', authMiddleware, adminController.editBrand);
router.delete('/brands/:id', authMiddleware, adminController.deleteBrand);

router.get('/approvalstatuses', adminController.getApprovalStatuses);
router.get('/approvalstatuses/:id', adminController.getApprovalStatusById);

module.exports = router;