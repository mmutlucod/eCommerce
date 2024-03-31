const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleCheckMiddleware } = require('../middlewares/AuthMiddleware');


router.post('/login', userController.login);
router.post('/register', userController.register);
// router.get('/listUsers', authMiddleware, roleCheckMiddleware('user'), userController.listUsers);
router.get('/my-account', authMiddleware, userController.getUserDetails);
router.put('/update-account', authMiddleware, userController.updateUserDetail);




module.exports = router;