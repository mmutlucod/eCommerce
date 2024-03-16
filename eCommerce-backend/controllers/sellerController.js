const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require("../models/seller");
const sellerProduct = require('../models/sellerProduct');
const Product = require('../models/product');
const ApprovalStatus = require('../models/approval_status');
const Brand = require('../models/Brand');
const Category = require('../models/category');
const { Op } = require('sequelize');


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
        console.log(seller.seller_id);
        const existingItem = await sellerProduct.findOne({
            where: {
                [Op.and]: [
                    { seller_id: 12 },
                    { product_id: req.body.product_id }
                ]
            }
        });
        console.log(existingItem);
        if (existingItem) {
            return res.status(404).json({ success: false, message: 'Bu ürünü zaten eklediniz.' });
        }
        await sellerProduct.create({
            seller_id: seller.seller_id,
            ...req.body
        });
        res.status(200).json({ success: true, message: 'Ürün eklendi.' });
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
                [Op.or]: [
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
    const { id } = req.params; // Ürün ID'sini URL parametresinden al

    try {
        const updatedProduct = await Product.update(
            { is_active: 1 }, // Güncellenecek alan ve değer
            { where: { seller_product_id: id } } // Hangi ürünün güncelleneceği
        );

        if (updatedProduct[0] === 0) { // Eğer güncellenen satır yoksa
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı veya zaten aktif.' });
        }
        return res.status(200).json({ success: true, message: 'Ürün başarıyla aktif hale getirildi.' });
    } catch (error) {
        console.error('Ürün aktifleştirme sırasında bir hata oluştu:', error);
        return res.status(500).json({ success: false, message: 'Ürünü aktifleştirme işlemi sırasında bir hata oluştu.' });
    }
};
const deactivateProduct = async (req, res) => {
    const { id } = req.params; // Ürün ID'sini istek gövdesinden al

    try {
        // Ürünü bul ve is_active alanını 1 olarak güncelle
        const updatedProduct = await Product.update(
            { is_active: 0 }, // Güncellenecek alan ve değer
            { where: { seller_product_id: id } } // Hangi ürünün güncelleneceği
        );

        // Güncelleme başarılıysa, bir yanıt dön
        if (updatedProduct[0] > 0) { // Sequelize update, güncellenen satırların sayısını dizi olarak döner
            return res.status(200).json({ success: true, message: 'Ürün başarıyla aktif hale getirildi.' });
        } else {
            // Belirtilen ID'ye sahip bir ürün bulunamazsa
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı veya zaten aktif.' });
        }
    } catch (error) {
        console.error('Ürün aktifleştirme sırasında bir hata oluştu:', error);
        return res.status(500).json({ success: false, message: 'Ürünü aktifleştirme işlemi sırasında bir hata oluştu.' });
    }
}
module.exports = {
    login, register, listSellers,
    getProducts, getProductDetailsById, createProduct, updateProduct, deactivateProduct, activateProduct
}