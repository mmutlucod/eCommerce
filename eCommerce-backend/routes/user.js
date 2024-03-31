const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');


// KULLANICI İŞLEMLERİ
router.post('/login', userController.login);
router.post('/register', userController.register);
// router.get('/listUsers', authMiddleware, roleCheckMiddleware('user'), userController.listUsers);
//PROFİLİM SAYFASI İŞLEMLERİ
router.get('/my-account', authMiddleware, userController.getUserDetails);
router.put('/update-account', authMiddleware, userController.updateUserDetail);

//SEPET - ÜRÜN İŞLEMLERİ
router.get('/my-basket', authMiddleware, userController.getCartItems);
router.post('/add-item', authMiddleware, userController.addItem);
router.post('/increase-item', authMiddleware, userController.increaseItem);
router.post('/delete-item', authMiddleware, userController.deleteItem);
// router.get('/products', authMiddleware, userController)

module.exports = router;