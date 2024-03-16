const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require("../models/seller");
const sellerProduct = require('../models/sellerProduct');
const Product = require('../models/product');
const ApprovalStatus = require('../models/approval_status');
const Brand = require('../models/Brand');
const Category = require('../models/category');

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


module.exports = {
    login, register, listSellers,
    getProducts, getProductDetailsById
}