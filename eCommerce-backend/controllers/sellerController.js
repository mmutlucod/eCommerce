const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require("../models/seller");
const sellerProduct = require('../models/sellerProduct');
const Product = require('../models/product');
const ApprovalStatus = require('../models/approval_status');
const Brand = require('../models/Brand');
const Category = require('../models/category');
const { Sequelize, Op } = require('sequelize');
const OrderItem = require('../models/orderItem');
const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');

//GİRİŞ
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Seller kullanıcısını kullanıcı adı ile ara
        const seller = await Seller.findOne({ where: { username } });

        // Kullanıcı bulunamazsa hata mesajı dön
        if (!seller) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Kullanıcının şifresini doğrula
        const passwordMatch = await bcrypt.compare(password, seller.password);

        // Şifre eşleşmiyorsa hata mesajı dön
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Token oluştur (token içinde yalnızca gerekli ve güvenli bilgileri sakla)
        const tokenPayload = { id: seller.id, username: seller.username, role: 'seller', sellerId: seller.id };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token süresi (örneğin 1 saat)
        });

        // Başarılı giriş yanıtı ve token dön
        return res.status(200).json({ message: 'Giriş başarılı.', token });
    } catch (error) {
        // Hata yakalama ve loglama
        console.error('Giriş sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Seller.findOne({ where: { username: username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Seller.create({ username: username, password: hashedPassword, approval_status_id: 3 });

        // Token oluştur
        const tokenPayload = { id: newUser.id, username: newUser.username, role: 'seller' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token süresi (örneğin 1 saat)
        });

        return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser, token });
    } catch (error) {
        console.error('Kullanıcı kaydı sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const listSellers = async (req, res) => {
    try {
        const sellers = await Seller.findAll();

        return res.status(200).json(sellers);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
//ÜRÜN 
const getProducts = async (req, res) => {
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const products = await sellerProduct.findAll({
            where: { seller_id: seller.seller_id },
            include: [{
                model: Product,
                attributes: ['name', 'description'],
                include: [{
                    model: Brand,
                    attributes: ['brand_name']
                },
                {
                    model: Category,
                    attributes: ['category_name']
                }]
            },
            {
                model: ApprovalStatus,
                attributes: ['status_name']
            }]
        });

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getProductDetailsById = async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const products = await sellerProduct.findByPk(id, {
            where: { username: req.user.username },
            include: [{
                model: Product,
                attributes: ['name', 'description'],
                include: [{
                    model: Brand,
                    attributes: ['brand_name']
                },
                {
                    model: Category,
                    attributes: ['category_name']
                }]
            },
            {
                model: ApprovalStatus,
                attributes: ['status_name']
            }]
        });

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const createProduct = async (req, res) => {
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const existingItem = await sellerProduct.findOne({
            where: {
                [Op.and]: [
                    { seller_id: seller.seller_id },
                    { product_id: req.body.product_id }
                ]
            }
        });
        if (existingItem) {
            return res.status(404).json({ success: false, message: 'Bu ürün ekleme talebiniz zaten mevcut.' });
        }
        await sellerProduct.create({
            seller_id: seller.seller_id,
            approval_status_id: 3,
            is_active: 0,
            ...req.body
        });
        res.status(200).json({ success: true, message: 'Ürün ekleme talebiniz iletildi.Moderatör tarafından onaylanınca ürünleriniz listelenecektir.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const product = await sellerProduct.findOne({
            where: {
                [Op.and]: [
                    { seller_product_id: id },
                    { seller_id: seller.seller_id }
                ]
            }
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı.' })
        }
        await product.update(updatedData);

        return res.status(200).json({ success: true, message: 'Ürün güncellendi' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
const activateProduct = async (req, res) => {
    const { id } = req.params; // Ürün ID'sini istek gövdesinden al

    try {
        // Ürünü bul ve is_active alanını 1 olarak güncelle

        const updateProduct = await sellerProduct.findByPk(id);

        // Güncelleme başarılıysa, bir yanıt dön
        if (!updateProduct) { // Sequelize update, güncellenen satırların sayısını dizi olarak döner
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı veya zaten aktif.' });
        }
        await updateProduct.update(
            { is_active: 1 }
        );

        return res.status(200).json({ success: true, message: 'Ürün başarıyla aktif hale getirildi.' });

    } catch (error) {
        console.error('Ürün aktifleştirme sırasında bir hata oluştu:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
const deactivateProduct = async (req, res) => {
    const { id } = req.params; // Ürün ID'sini istek gövdesinden al

    try {
        // Ürünü bul ve is_active alanını 1 olarak güncelle

        const updateProduct = await sellerProduct.findByPk(id);

        // Güncelleme başarılıysa, bir yanıt dön
        if (!updateProduct) { // Sequelize update, güncellenen satırların sayısını dizi olarak döner
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı veya zaten pasif.' });
        }
        await updateProduct.update(
            { is_active: 0 }
        );

        return res.status(200).json({ success: true, message: 'Ürün başarıyla pasif hale getirildi.' });

    } catch (error) {
        console.error('Ürün kaldırma sırasında bir hata oluştu:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
// MARKA
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();

        return res.status(200).json(brands);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getSellerBrands = async (req, res) => {
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const brands = await Brand.findAll({ where: { seller_id: seller.seller_id } });

        return res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createBrand = async (req, res) => {
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const brand = await Brand.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('brand_name')),
                Sequelize.fn('LOWER', req.body.brand_name)
            )
        });

        if (!brand) {
            return res.status(404).json({ success: false, message: 'Bu marka zaten sistemde mevcut.' });
        }

        return res.status(200).json({ success: true, message: 'Marka ekleme talebiniz iletildi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const updateBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        const brand = await Brand.findOne({
            where: {
                [Op.and]: [
                    { seller_id: seller.seller_id },
                    { brand_id: id }
                ]
            }
        });

        await Brand.update({
            approval_status_id: 3,
            seller_id: seller.seller_id,
            ...req.body
        })

        res.status(200).json({ success: true, message: 'Marka güncelleme talebiniz alındı.' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const searchBrand = async (req, res) => {
    const { search } = req.query; // Arama terimi, query string üzerinden alınır

    try {
        if (!search) {
            return res.status(400).json({ success: false, message: 'Arama terimi gereklidir.' });
        }

        // MySQL için büyük/küçük harfe duyarlı olmayan arama
        const brands = await Brand.findAll({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('brand_name')),
                'LIKE', `%${search.toLowerCase()}%`
            )
        });

        return res.status(200).json(brands);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
//KATEGORİ
const getAllCategories = async (req, res) => {
    try {
        const categoriesWithSubcategories = await fetchCategoriesWithSubcategories(); // En üst seviye kategoriler için null kullanılıyor
        return res.json(categoriesWithSubcategories);
    } catch (error) {
        console.error('Error fetching categories with subcategories:', error);
        return res.status(500).send('Server error');
    }
}
const getAllCategoriesWithSearch = async (req, res) => {
    try {
        const { search } = req.query; // URL'den arama terimini al
        const categories = search
            ? await searchCategories(search) // Arama terimi varsa arama yap
            : await fetchCategoriesWithSubcategories(); // Yoksa tüm kategorileri getir
        return res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).send('Server error');
    }
}
//SİPARİŞLER
const getSellerOrders = async (req, res) => {
    try {
        const seller = await Seller.findOne({ where: { username: req.user.username } });
        if (!seller) {
            return res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }
        const sellerOrders = await OrderItem.findAll({
            attributes: ['quantity', 'order_id'],
            include: [
                {
                    model: sellerProduct, // Doğru model ismi
                    where: { seller_id: seller.seller_id }, // seller.seller_id değil, doğru alan adı seller.id olmalı
                    attributes: ['price'], // Ürün fiyatı
                    include: [{
                        model: Product,
                        attributes: ['name'],
                        include: [{
                            model: Brand,
                            attributes: ['brand_name']
                        }]
                    }]
                },
                {
                    model: OrderStatus,
                    attributes: ['status_name']
                }
            ],
            // order: [['Order', 'createdAt', 'DESC']] Bu satırı kaldırdım çünkü Order modeli doğrudan include edilmemiş
        });

        return res.status(200).json(sellerOrders);
    } catch (error) {
        console.error('Error fetching seller orders:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const cancelOrderItemQuantity = async (req, res) => {
    const { orderItemId, quantityToCancel } = req.body;

    try {
        const orderItem = await OrderItem.findByPk(orderItemId);

        if (!orderItem) {
            return res.status(404).json({ success: false, message: 'Order item not found.' });
        }

        // İptal edilecek miktarın geçerli olup olmadığını kontrol et
        if (quantityToCancel <= 0 || quantityToCancel > orderItem.quantity) {
            return res.status(400).json({ success: false, message: 'Invalid cancellation quantity.' });
        }

        // Yeni iptal edilen miktarı hesapla ve mevcut miktarı güncelle
        const newCanceledQuantity = (orderItem.canceled_quantity || 0) + quantityToCancel;
        const newQuantity = orderItem.quantity - quantityToCancel;

        // OrderItem güncelleme
        await OrderItem.update(
            {
                quantity: newQuantity,
                canceled_quantity: newCanceledQuantity,
                // Tamamen iptal edilmişse, durumu güncelleyin (Örneğin, 'cancelled' durumunun ID'si)
                // Bu kısmı, durum IDsine göre uyarlayın
                order_status_id: newQuantity === 0 ? 4 : orderItem.order_status_id
            },
            { where: { order_item_id: orderItemId } }
        );

        return res.json({ success: true, message: 'Order item quantity cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling order item quantity:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


//MARKA ARAMA ASYNC FUNC.
async function fetchCategoriesWithSubcategories() {
    // Tüm kategorileri çek
    const categories = await Category.findAll({
        attributes: ['id', 'category_name', 'category_id']
    });

    // Kategorileri bir sözlük olarak düzenle
    const categoriesMap = categories.reduce((acc, category) => {
        acc[category.id] = category.toJSON();
        acc[category.id].subCategories = []; // Alt kategorileri tutacak bir alan ekle
        return acc;
    }, {});

    // Her kategori için, eğer üst kategorisi varsa, üst kategorinin alt kategorileri listesine ekle
    categories.forEach(category => {
        if (category.category_id !== null && categoriesMap[category.category_id]) {
            categoriesMap[category.category_id].subCategories.push(categoriesMap[category.id]);
        }
    });

    // En üst seviyedeki kategorileri bul (category_id'si null olanlar)
    const topLevelCategories = categories.filter(category => category.category_id === null)
        .map(category => categoriesMap[category.id]);

    // Hiyerarşi ağacını döndür
    return topLevelCategories;
}
//KATEGORİ ARAMA ASYNC FUNC.
async function searchCategories(search) {
    const allCategories = await fetchCategoriesWithSubcategories();

    function filterCategories(categories) {
        return categories.filter(category => {
            // Kategori adı arama terimini içeriyorsa veya alt kategorilerden herhangi biri arama terimine uyuyorsa true döndür
            const hasMatchInSubcategories = category.subCategories.length > 0 && filterCategories(category.subCategories).length > 0;
            return category.category_name.toLowerCase().includes(search.toLowerCase()) || hasMatchInSubcategories;
        }).map(category => ({
            ...category,
            subCategories: filterCategories(category.subCategories)
        }));
    }

    return filterCategories(allCategories);
}
module.exports = {
    login, register, listSellers,
    getProducts, getProductDetailsById, createProduct, updateProduct, deactivateProduct, activateProduct,
    getAllBrands, getSellerBrands, createBrand, updateBrand, searchBrand,
    getAllCategories, getAllCategoriesWithSearch,
    getSellerOrders, cancelOrderItemQuantity
}