const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleCheckMiddleware, authOptionalMiddleware } = require('../middlewares/AuthMiddleware');


// KULLANICI İŞLEMLERİ

router.post('/login', userController.login);
router.post('/register', userController.register);
// router.get('/listUsers', authMiddleware, roleCheckMiddleware('user'), userController.listUsers);

//PROFİLİM SAYFASI İŞLEMLERİ
router.get('/my-account', authMiddleware, roleCheckMiddleware('user'), userController.getUserDetails);
router.put('/update-account', authMiddleware, roleCheckMiddleware('user'), userController.updateUserDetail);

//SEPET - ÜRÜN İŞLEMLERİ
router.get('/my-basket', authMiddleware, roleCheckMiddleware('user'), userController.getCartItems);
router.get('/topselling', authMiddleware, roleCheckMiddleware('user'), userController.getTopSellingProducts);
router.post('/add-item', authMiddleware, roleCheckMiddleware('user'), userController.addItem);
router.post('/update-item', authMiddleware, roleCheckMiddleware('user'), userController.updateItem);
router.post('/delete-item', authMiddleware, roleCheckMiddleware('user'), userController.deleteItem);
router.post('/clear-cart', authMiddleware, roleCheckMiddleware('user'), userController.clearCart);

///////////////////////////////////////////////////////////////////////////////////////
//LİSTE İŞLEMLERİ

router.get('/lists', authMiddleware, roleCheckMiddleware('user'), userController.getLists);
router.post('/create-list', authMiddleware, roleCheckMiddleware('user'), userController.createList);
router.post('/delete-list/:listId', authMiddleware, roleCheckMiddleware('user'), userController.deleteList);
router.post('/update-list/:listId', authMiddleware, roleCheckMiddleware('user'), userController.updateList);

//herkese açık liste için özel link erişimi
router.get('/publicList/:slug', userController.getPublicListItemsBySlug);

//LİSTE - İTEM İŞLEMLERİ

router.get('/lists/:listId/items', authMiddleware, roleCheckMiddleware('user'), userController.getItemsByListId);
router.post('/add-Item-to-List', authMiddleware, roleCheckMiddleware('user'), userController.addItemToList);
router.post('/remove-Item-to-List', authMiddleware, roleCheckMiddleware('user'), userController.removeItemFromList);

///////////////////////////////////////////////////////////////////////////////////////

//ADRES İŞLEMLERİ

router.get('/addresses', authMiddleware, roleCheckMiddleware('user'), userController.getAddresses);
router.post('/create-address', authMiddleware, roleCheckMiddleware('user'), userController.createAddress);
router.put('/addresses/:addressId', authMiddleware, roleCheckMiddleware('user'), userController.updateAddress);
router.delete('/addresses/:addressId', authMiddleware, roleCheckMiddleware('user'), userController.deleteAddress);

//SİPARİŞ İŞLEMLERİ

router.get('/orders', authMiddleware, roleCheckMiddleware('user'), userController.getorders);
router.get('/order/:orderId', authMiddleware, roleCheckMiddleware('user'), userController.getorder);
router.get('/orderItems/:orderId', authMiddleware, roleCheckMiddleware('user'), userController.getOrderItems);
router.post('/create-order', authMiddleware, roleCheckMiddleware('user'), userController.createOrder);
router.post('/cancel-order-item', authMiddleware, roleCheckMiddleware('user'), userController.cancelOrderItem);
router.post('/cancel-order', authMiddleware, roleCheckMiddleware('user'), userController.cancelOrder);

//FAVORİ İŞLEMLERİ

router.get('/favorites', authMiddleware, roleCheckMiddleware('user'), userController.getFavorites);
router.post('/addFavoriteItem', authMiddleware, roleCheckMiddleware('user'), userController.addFavoriteItem);
router.post('/deleteFavoriteItem', authMiddleware, roleCheckMiddleware('user'), userController.deleteFavoriteItem);

// ÜRÜN DEĞERLENDİRME  İŞLEMLERİ

router.get('/product-comments/:productId', authOptionalMiddleware, userController.getProductComments);
router.get('/my-product-comments', authMiddleware, roleCheckMiddleware('user'), userController.getProductCommentsByUser);
router.post('/create-product-comment', authMiddleware, roleCheckMiddleware('user'), userController.createProductComments);
router.post('/update-product-comment', authMiddleware, roleCheckMiddleware('user'), userController.updateProductComments);
router.post('/delete-product-comment', authMiddleware, roleCheckMiddleware('user'), userController.deleteProductComments);

// SATICI DEĞERLENDİRME İŞLEMLERİ

router.get('/seller-comments/:sellerId', authMiddleware, roleCheckMiddleware('user'), userController.getSellerComments);
router.get('/my-seller-comments', authMiddleware, roleCheckMiddleware('user'), userController.getSellerCommentsByUser);
router.post('/create-seller-comment', authMiddleware, roleCheckMiddleware('user'), userController.createSellerComment);
router.post('/update-seller-comment', authMiddleware, roleCheckMiddleware('user'), userController.updateSellerComments);
router.post('/delete-seller-comment', authMiddleware, roleCheckMiddleware('user'), userController.deleteSellerComments);

// TAKİP İŞLEMLERİ

router.post('/follow', authMiddleware, roleCheckMiddleware('user'), userController.toggleFollowSeller);
router.get('/follow-status/:sellerId', authMiddleware, roleCheckMiddleware('user'), userController.checkFollowStatus);
router.get('/followed-sellers', authMiddleware, roleCheckMiddleware('user'), userController.getFollowedSellers);

// İADE İŞLEMLERİ

router.post('/create-return', authMiddleware, roleCheckMiddleware('user'), userController.createReturnRequest);
router.get('/my-returns', authMiddleware, roleCheckMiddleware('user'), userController.getUserReturnRequests);
router.post('/cancel-return', authMiddleware, roleCheckMiddleware('user'), userController.cancelReturnRequest);

// ÜRÜN SORU İŞLEMLERİ

router.post('/create-product-question', authMiddleware, roleCheckMiddleware('user'), userController.askQuestion);
router.get('/my-questions', authMiddleware, roleCheckMiddleware('user'), userController.listMyQuestions);
router.get('/products/:productId/answered-questions', userController.getAnsweredQuestionsForProduct); //Lokal işlem

//KATEGORİ İŞLEMLERİ

router.get('/categories', authOptionalMiddleware, userController.getCategories);
router.get('/categories/:categoryId', authOptionalMiddleware, userController.getSubCategoriesById);

//ARAMA İŞLEMLERİ

router.get('/urunAra', authOptionalMiddleware, userController.searchProducts);

//LOKAL İŞLEMLER
// ürün sayfası => ürün bilgisi(açıklama, yorum, özellikler, kampanya**, ... )
// ana sayfa => ürün bilgileri(foto,isim, marka), kategoriler(kategorilere göre ürün çekme),
// satıcı sayfası => satıcı bilgileri(satıcıya ait ürünler,sorular, satıcı profili)
// arama işlemleri => ?? bu kısımda yazılan bir ifadeye göre ürün özellikleri çekilecek 
// ve filtreleme işlemleri ürün özellikleri arasından yapılacak

//SLUG KULLANIMI

router.get('/products', authOptionalMiddleware, userController.getProducts);
router.get('/product/:productSlug', authOptionalMiddleware, userController.getProductsBySlug);
router.get('/products/:productSlug', authOptionalMiddleware, userController.getProductsBySellerSlug);
router.get('/seller-products/:sellerSlug', authOptionalMiddleware, userController.getProductsBySeller); // Satıcının ürünleri
router.get('/sellerProducts/:productId/:sellerProductId', authOptionalMiddleware, userController.getSellerProductByProductId); // Ürünün satıcıları
//Diğer satıcılar


router.get('/sellerInfo/:sellerSlug', authOptionalMiddleware, userController.getSellerInfo);
router.get('/category/:categorySlug', authOptionalMiddleware, userController.getProductsByCategorySlug);
router.get('/brand/:brandSlug', authOptionalMiddleware, userController.getProductsByBrandSlug);

router.get('/productPhoto/:productId', authOptionalMiddleware, userController.getPhotos);

router.get('/commentControl/:productId', authMiddleware, roleCheckMiddleware('user'), userController.commentControl)

module.exports = router;