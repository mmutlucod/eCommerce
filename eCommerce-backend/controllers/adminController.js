const bcrypt = require('bcrypt'); // Şifreleri güvenli bir şekilde saklamak için bcrypt kütüphanesini kullanıyoruz
const Admin = require('../models/admin');
const Authenticate = require('../middlewares/AuthMiddleware');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Category = require('../models/category');
const { where } = require('sequelize');
const User = require('../models/user');
const Moderator = require('../models/moderator');
const Brand = require('../models/Brand');
const ApprovalStatus = require('../models/approval_status');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const sellerProduct = require('../models/sellerProduct');
const Seller = require('../models/seller');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Admin kullanıcısını kullanıcı adı ile ara
        const admin = await Admin.findOne({ where: { username } });

        // Kullanıcı bulunamazsa hata mesajı dön
        if (!admin) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Kullanıcının şifresini doğrula
        const passwordMatch = await bcrypt.compare(password, admin.password);

        // Şifre eşleşmiyorsa hata mesajı dön
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Token oluştur (token içinde yalnızca gerekli ve güvenli bilgileri sakla)
        const tokenPayload = { id: admin.id, username: admin.username, role: 'admin' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token süresi (örneğin 1 saat)
        });

        // Başarılı giriş yanıtı ve token dön
        res.status(200).json({ message: 'Giriş başarılı.', token });
    } catch (error) {
        // Hata yakalama ve loglama
        console.error('Giriş sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Admin.findOne({ where: { username: username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Admin.create({ username: username, password: hashedPassword });

        // Token oluştur
        const tokenPayload = { id: newUser.id, username: newUser.username, role: 'admin' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token süresi (örneğin 1 saat)
        });

        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser, token });
    } catch (error) {
        console.error('Kullanıcı kaydı sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const listAdmins = async (req, res) => {
    try {
        // Tüm admin kullanıcılarını veritabanından çek
        const admins = await Admin.findAll();

        // Başarılı yanıtı dön
        res.status(200).json(admins);
    } catch (error) {
        // Hata durumunda hata mesajını döndür
        res.status(500).json({ success: false, message: error.message });
    }
};
//ÜRÜN
const getProducts = async (req, res) => {
    try {
        // Tüm admin kullanıcılarını veritabanından çek
        const products = await Product.findAll({
            include: [
                {
                    model: Brand,
                    attributes: ['brand_name'], // Markanın sadece adını dahil et
                },
                {
                    model: Category,
                    attributes: ['category_name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: Moderator,
                    attributes: ['name']
                }
            ]
        });

        // Başarılı yanıtı dön
        res.status(200).json(products);
    } catch (error) {
        // Hata durumunda hata mesajını döndür
        res.status(500).json({ success: false, message: error.message });
    }
}
const getProductsById = async (req, res) => {
    // Ürün ID'sini URL parametrelerinden al
    const { id } = req.params;

    try {
        // ID'ye göre ürünü veritabanından bul
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Brand,
                    attributes: ['brand_name'], // Markanın sadece adını dahil et
                },
                {
                    model: Category,
                    attributes: ['category_name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: Moderator,
                    attributes: ['name']
                }
                // Diğer ilişkili modelleri de benzer şekilde ekleyebilirsiniz
            ]
        });

        if (!product) {
            // Ürün bulunamazsa, 404 hata mesajı dön
            return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
        }

        // Ürün bulunursa, ürün bilgisini dön
        res.status(200).json(product);
    } catch (error) {
        // Hata durumunda genel hata mesajını döndür
        res.status(500).json({ success: false, message: error.message });
    }
}
const createProduct = async (req, res) => {
    // İstek gövdesinden ürün bilgilerini al

    try {
        // Yeni ürünü veritabanına ekle
        const product = await Product.create(req.body);

        // Ürün başarıyla oluşturulduysa, ürün bilgisini içeren bir yanıt dön
        res.status(201).json({ success: true, message: 'Ürün başarıyla oluşturuldu.', product });
    } catch (error) {
        // Ürün oluşturma işlemi sırasında bir hata oluşursa, hata mesajını döndür
        res.status(500).json({ success: false, message: 'Ürün oluşturulurken bir hata oluştu.', error: error.message });
    }
};

const editProduct = async (req, res) => {
    const { id } = req.params; // URL'den ürün ID'si alınır
    const updatedData = req.body; // İstek gövdesinden güncellenecek veriler alınır

    try {
        // ID ile ürünü bul
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
        }

        // Ürünü güncelle
        await product.update(updatedData);

        // Güncellenmiş ürün bilgisi ile yanıt dön
        res.status(200).json({ success: true, message: "Ürün başarıyla güncellendi.", product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const deleteProduct = async (req, res) => {
    const { id } = req.params; // URL'den ürün ID'si alınır

    try {
        // ID ile ürünü bul ve sil
        const deleted = await Product.destroy({ where: { product_id: id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Silinecek ürün bulunamadı." });
        }

        // Silme işlemi başarılıysa yanıt dön
        res.status(200).json({ success: true, message: "Ürün başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//KATEGORİ
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: Category,
                    as: 'SubCategories',
                    attributes: ['category_name'], // Markanın sadece adını dahil et
                },
                {
                    model: Moderator,
                    attributes: ['name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name'] // Durum
                }
            ]
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getCategoriesById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'SubCategories',
                    attributes: ['category_name'], // Markanın sadece adını dahil et
                },
                {
                    model: Moderator,
                    attributes: ['name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name'] // Durum
                }
            ]
        });
        if (!category) {
            res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createCategory = async (req, res) => {
    try {
        // Kategoriyi veritabanına ekle
        const category = await Category.create(req.body);

        // Kategori başarıyla oluşturulduysa, ürün bilgisini içeren bir yanıt dön
        res.status(201).json({ success: true, message: 'Kategori başarıyla oluşturuldu.', category });
    } catch (error) {
        // Kategori oluşturma işlemi sırasında bir hata oluşursa, hata mesajını döndür
        res.status(500).json({ success: false, message: 'Kategori oluşturulurken bir hata oluştu.', error: error.message });
    }
}
const editCategory = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Kategori bulunamadı." });
        }

        await category.update(updatedData);

        res.status(200).json({ success: true, message: 'Kategori başarıyla güncellendi.', category });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Category.destroy({ where: { id: id } });
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Silinecek kategori bulunamadı.' });
        }
        res.status(200).json({ success: true, message: 'Kategori başarıyla silindi.' })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
//KULLANICI
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getUsersById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({ success: true, message: 'Kullanıcı başarıyla oluşturuldu.' }, user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const editUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        await user.update(updatedData);

        res.status(200).json({ success: true, message: 'Kullanıcı başarıyla güncellendi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.destroy({ where: { user_id: id } });
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Silinecek kullanıcı bulunamadı.' });
        }
        res.status(200).json({ success: true, message: 'Kullanıcı başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
//MODERATOR
const getModerators = async (req, res) => {
    try {
        const moderators = await Moderator.findAll();

        res.status(200).json(moderators);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getModeratorsById = async (req, res) => {
    const { id } = req.params;
    try {
        const moderator = await Moderator.findByPk(id);

        if (!moderator) {
            res.status(404).json({ success: false, message: 'Moderatör bulunamadı.' });
        }

        res.status(200).json(moderator);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createModerator = async (req, res) => {
    try {
        const moderator = await Moderator.create(req.body);

        res.status(201).json({ success: true, message: 'Moderatör oluşturuldu.', moderator });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const editModerator = async (req, res) => {
    const { id } = req.params;
    try {
        const moderator = await Moderator.findByPk(id);

        if (!moderator) {
            res.status(404).json({ success: false, message: 'Moderatör bulunamadı.' });
        }
        await moderator.update(req.body);

        res.status(200).json({ success: true, message: 'Moderatör başarıyla güncellendi.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const deleteModerator = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = Moderator.destroy({ where: { modertor_id: id } });

        if (!deleted) {
            res.status(404).json({ success: false, message: 'Böyle bir moderatör bulunamadı.' });
        }
        res.status(200).json({ success: true, message: 'Moderatör silindi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
//SİPARİŞLER
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                attributes: ['quantity'], // Ürün Adedi
                include: [{
                    model: sellerProduct, // Model isminin doğru olduğundan emin olun.
                    attributes: ['price'], // Ürün Fiyatı
                    include: [
                        {
                            model: Seller,
                            attributes: ['name'] // Satıcı Adı
                        },
                        {
                            model: Product,
                            attributes: ['name'] // Ürün Adı
                        }
                    ]
                }
                ]
            },
            {
                model: User,
                attributes: ['user_id', 'name', 'surname']
            }]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getOrderDetailsById = async (req, res) => {
    const { id } = req.params;

    try {
        const orderdetails = await Order.findByPk(id, {
            include: [{
                model: OrderItem,
                attributes: ['quantity'], // Ürün Adedi
                include: [{
                    model: sellerProduct, // Model isminin doğru olduğundan emin olun.
                    attributes: ['price'], // Ürün Fiyatı
                    include: [
                        {
                            model: Seller,
                            attributes: ['name'] // Satıcı Adı
                        },
                        {
                            model: Product,
                            attributes: ['name'] // Ürün Adı
                        }
                    ]
                }
                ]
            },
            {
                model: User,
                attributes: ['user_id', 'name', 'surname']
            }]
        });

        res.status(200).json(orderdetails);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}
const updateOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
        }

        await order.update(req.body);

        res.status(200).json({ success: true, message: 'Sipariş başarıyla güncellendi.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
//SATICI
const getSellers = async (req, res) => {
    try {
        const sellers = await Seller.findAll({
            include: [
                {
                    model: ApprovalStatus,
                    attributes: ['status_name']
                },
                {
                    model: Category,
                    attributes: ['id', 'category_name']
                },
                {
                    model: Moderator,
                    attributes: ['moderator_id', 'name', 'surname']
                }

            ]
        });

        res.status(200).json(sellers);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getSellerById = async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findByPk(id, {
            include: [
                {
                    model: ApprovalStatus,
                    attributes: ['status_name']
                },
                {
                    model: Category,
                    attributes: ['id', 'category_name']
                },
                {
                    model: Moderator,
                    attributes: ['moderator_id', 'name', 'surname']
                }

            ]
        });

        if (!seller) {
            res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }


        res.status(200).json(seller);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const createSeller = async (req, res) => {
    try {
        const seller = await Seller.create(req.body);

        res.status(201).json({ success: true, message: 'Satıcı oluşturuldu.', seller });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const editSeller = async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findByPk(id);

        if (!seller) {
            res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }
        await seller.update(req.body);

        res.status(200).json({ success: true, message: 'Satıcı başarıyla güncellendi.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}
const deleteSeller = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Seller.destroy({ where: { seller_id: id } });

        if (!deleted) {
            res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }
        res.status(200).json({ success: true, message: 'Satıcı başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = {
    login, register, listAdmins,
    getProducts, getProductsById, createProduct, editProduct, deleteProduct,
    getCategories, getCategoriesById, createCategory, editCategory, deleteCategory,
    getUsers, getUsersById, createUser, editUser, deleteUser,
    getModerators, getModeratorsById, createModerator, editModerator, deleteModerator,
    getOrders, getOrderDetailsById, updateOrder,
    getSellers, getSellerById, createSeller, editSeller, deleteSeller

};