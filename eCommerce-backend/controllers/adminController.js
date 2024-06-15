const bcrypt = require('bcrypt'); // Şifreleri güvenli bir şekilde saklamak için bcrypt kütüphanesini kullanıyoruz
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');
const Brand = require('../models/Brand');
const ApprovalStatus = require('../models/approval_status');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const sellerProduct = require('../models/sellerProduct');
const Seller = require('../models/seller');
const saltRounds = 10; // Bcrypt için salt tur sayısı
const { Sequelize, Op, where } = require('sequelize');
const ProductComment = require('../models/productComment');
const productQuestion = require('../models/productQuestion');
const productImage = require('../models/productImage');
const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');



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
        const tokenPayload = { id: admin.admin_id, username: admin.username, role: 'admin' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '100y', // Token süresi (örneğin 1 saat)
        });

        // Başarılı giriş yanıtı ve token dön
        return res.status(200).json({ message: 'Giriş başarılı.', token, role: 'admin' });
    } catch (error) {
        // Hata yakalama ve loglama
        console.error('Giriş sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
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

        return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser, token });
    } catch (error) {
        console.error('Kullanıcı kaydı sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const listAdmins = async (req, res) => {
    try {
        // Tüm admin kullanıcılarını veritabanından çek
        const admins = await Admin.findAll();

        // Başarılı yanıtı dön
        return res.status(200).json(admins);
    } catch (error) {
        // Hata durumunda hata mesajını döndür
        return res.status(500).json({ success: false, message: error.message });
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
                },
                {
                    model: Category,
                },
                {
                    model: Admin,
                },
                {
                    model: ApprovalStatus,
                },

            ]
        });

        // Başarılı yanıtı dön
        return res.status(200).json(products);
    } catch (error) {
        // Hata durumunda hata mesajını döndür
        return res.status(500).json({ success: false, message: error.message });
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
                    model: Admin,
                    attributes: ['username', 'full_name']
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name']
                }
                // Diğer ilişkili modelleri de benzer şekilde ekleyebilirsiniz
            ]
        });

        if (!product) {
            // Ürün bulunamazsa, 404 hata mesajı dön
            return res.status(404).json({ success: false, message: "Ürün bulunamadı." });
        }

        // Ürün bulunursa, ürün bilgisini dön
        return res.status(200).json(product);
    } catch (error) {
        // Hata durumunda genel hata mesajını döndür
        return res.status(500).json({ success: false, message: error.message });
    }
}

const createProduct = async (req, res) => {
    const transaction = await Product.sequelize.transaction(); // Transaction başlat
    try {
        const admin = await Admin.findOne({ where: { username: req.user.username } });
        const product = await Product.findOne({
            where: {
                stock_code: req.body.stock_code
            }
        });

        if (product) {
            res.status(409).json({ success: false, message: 'Bu ürün zaten sistemde mevcut.' });
        } else {

            const currentDateTime = new Date(); // Geçerli tarih ve saat bilgisini al
            const slugDatePart = `${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}`; // YYYYMMDD formatında tarih kısmını oluştur
            const slugTimePart = `${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`; // HHMMSS formatında saat kısmını oluştur
            const slug = slugify(`${req.body.name}-${slugDatePart}-x-${slugTimePart}`, {
                replacement: '-',  // Boşlukları '-' ile değiştir
                lower: true,       // Küçük harfe çevir
                remove: /[*+~.()'"!:@/]/g // Slug oluştururken kaldırılacak karakterler
            });

            const newProduct = await Product.create({
                ...req.body,
                approval_status_id: 1,
                max_buy: 5,
                slug: slug,
                admin_id: admin.admin_id
            }, { transaction });

            // Dosya isimlerini al ve productImages tablosuna ekle
            const imagePaths = req.files.map(file => ({
                product_id: newProduct.product_id,
                image_path: file.filename
            }));

            await productImage.bulkCreate(imagePaths, { transaction });

            await transaction.commit();
            res.status(200).json({ success: true, message: 'Ürün ve resimler sisteme eklendi.' });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
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
        return res.status(200).json({ success: true, message: "Ürün başarıyla güncellendi.", product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
        return res.status(200).json({ success: true, message: "Ürün başarıyla silindi." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const searchProduct = async (req, res) => {
    const { search } = req.query;

    try {
        // Ürünleri arama koşuluyla bul
        const products = await Product.findAll({
            where: search ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    // Daha fazla arama koşulu ekleyebilirsiniz
                ]
            } : {},
            include: [
                {
                    model: Brand,
                    attributes: ['brand_name'],
                    where: search ? { brand_name: { [Op.like]: `%${search}%` } } : undefined,
                    required: false
                },
                {
                    model: Category,
                    attributes: ['category_name'],
                    where: search ? { category_name: { [Op.like]: `%${search}%` } } : undefined,
                    required: false
                },
                {
                    model: Admin,
                    attributes: ['username', 'full_name']
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name']
                }
            ]
        });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
                    model: Admin,
                    attributes: ['username', 'full_name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name'] // Durum
                }
            ]
        });

        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
                    model: Admin,
                    attributes: ['username', 'full_name'], // Kategorinin sadece adını dahil et
                },
                {
                    model: ApprovalStatus,
                    attributes: ['status_name'] // Durum
                }
            ]
        });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
        }
        return res.status(200).json(category);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const createCategory = async (req, res) => {
    try {
        const admin = await Admin.findOne({ where: { username: req.user.username } });
        // Kategoriyi veritabanına ekle

        const currentDateTime = new Date(); // Geçerli tarih ve saat bilgisini al
        const slugDatePart = `${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}`; // YYYYMMDD formatında tarih kısmını oluştur
        const slugTimePart = `${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`; // HHMMSS formatında saat kısmını oluştur
        const slug = slugify(`${req.body.name}-${slugDatePart}-x-${slugTimePart}`, {
            replacement: '-',  // Boşlukları '-' ile değiştir
            lower: true,       // Küçük harfe çevir
            remove: /[*+~.()'"!:@]/g // Slug oluştururken kaldırılacak karakterler
        });

        const control = await Category.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('category_name')),
                Sequelize.fn('LOWER', req.body.category_name)
            )
        });

        if (control) {
            return res.status(404).json({ success: false, message: 'Bu kategori zaten sistemde mevcut.' });
        }



        const category = await Category.create({
            ...req.body,
            approval_status_id: 1,
            admin_id: admin.admin_id,
            slug: slug
        });

        // Kategori başarıyla oluşturulduysa, ürün bilgisini içeren bir yanıt dön
        return res.status(201).json({ success: true, message: 'Kategori başarıyla oluşturuldu.', category });
    } catch (error) {
        // Kategori oluşturma işlemi sırasında bir hata oluşursa, hata mesajını döndür
        return res.status(500).json({ success: false, message: 'Kategori oluşturulurken bir hata oluştu.', error: error.message });
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

        return res.status(200).json({ success: true, message: 'Kategori başarıyla güncellendi.', category });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Category.destroy({ where: { id: id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Silinecek kategori bulunamadı.' });
        }
        return res.status(200).json({ success: true, message: 'Kategori başarıyla silindi.' })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
//KULLANICI
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getUsersById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        // Kullanıcı adı veya e-posta adresi ile mevcut kullanıcıyı kontrol et
        const existingUser = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        // Eğer kullanıcı zaten varsa, bir hata mesajı gönder
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'E-posta adresi zaten kullanımda.' });
        }

        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Kullanıcıyı şifreyle birlikte oluştur
        const user = await User.create({
            ...req.body,
            password: hashedPassword, // Hash'lenmiş şifreyi kullan
        });

        // Başarılı bir şekilde oluşturulduğunu bildir
        return res.status(201).json({ success: true, message: 'Kullanıcı başarıyla oluşturuldu.', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const editUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        await user.update(updatedData);

        return res.status(200).json({ success: true, message: 'Kullanıcı başarıyla güncellendi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.destroy({ where: { user_id: id } });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Silinecek kullanıcı bulunamadı.' });
        }
        return res.status(200).json({ success: true, message: 'Kullanıcı başarıyla silindi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getOrderDetailsById = async (req, res) => {
    const { id } = req.params;

    try {
        const orderdetails = await Order.findByPk(id, {
            include: [{
                model: OrderItem,
                attributes: ['quantity', 'price'], // Ürün Adedi
                include: [{
                    model: sellerProduct, // Model isminin doğru olduğundan emin olun.
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

        return res.status(200).json(orderdetails);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}
const updateOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
        }

        await order.update(req.body);

        return res.status(200).json({ success: true, message: 'Sipariş başarıyla güncellendi.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
                    model: Admin,
                    attributes: ['admin_id', 'username', 'full_name']
                }

            ]
        });

        return res.status(200).json(sellers);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
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
                    model: Admin,
                    attributes: ['admin_id', 'username', 'full_name']
                }

            ]
        });

        if (!seller) {
            return res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }


        return res.status(200).json(seller);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const createSeller = async (req, res) => {
    try {
        const seller = await Seller.create(req.body);

        return res.status(201).json({ success: true, message: 'Satıcı oluşturuldu.', seller });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const editSeller = async (req, res) => {
    const { id } = req.params;
    try {
        const seller = await Seller.findByPk(id);

        if (!seller) {
            return res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }
        await seller.update(req.body);

        return res.status(200).json({ success: true, message: 'Satıcı başarıyla güncellendi.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}
const deleteSeller = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Seller.destroy({ where: { seller_id: id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
        }
        return res.status(200).json({ success: true, message: 'Satıcı başarıyla silindi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
//MARKA

const getBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll({
            include: [{
                model: ApprovalStatus,
                attributes: ['status_name']
            }]
        });

        return res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id, {
            include: [{
                model: ApprovalStatus,
                attributes: ['status_name']
            }]
        });

        if (!brand) {
            return res.status(404).json({ success: false, message: 'Marka bulunamadı.' });
        }


        return res.status(200).json(brand);
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const createBrand = async (req, res) => {
    try {

        const admin = await Admin.findOne({ where: { username: req.user.username } });

        const currentDateTime = new Date(); // Geçerli tarih ve saat bilgisini al
        const slugDatePart = `${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}`; // YYYYMMDD formatında tarih kısmını oluştur
        const slugTimePart = `${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`; // HHMMSS formatında saat kısmını oluştur
        const slug = slugify(`${req.body.brand_name}-${slugDatePart}-x-${slugTimePart}`, {
            replacement: '-',  // Boşlukları '-' ile değiştir
            lower: true,       // Küçük harfe çevir
            remove: /[*+~.()'"!:@]/g // Slug oluştururken kaldırılacak karakterler
        });

        const control = await Brand.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('brand_name')),
                Sequelize.fn('LOWER', req.body.brand_name)
            )
        });

        if (control) {
            return res.status(404).json({ success: false, message: 'Bu marka zaten sistemde mevcut.' });
        }

        const brand = await Brand.create({
            ...req.body,
            slug: slug,
            approval_status_id: 1,
            admin_id: admin.admin_id
        });

        return res.status(201).json({ success: true, message: 'Marka eklendi.', brand });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const editBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id);

        if (!brand) {
            return res.status(404).json({ success: false, message: 'Silinecek marka bulunamadı.' })
        }
        await brand.update(req.body);
        return res.status(200).json({ success: true, message: 'Marka başarıyla güncellendi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Brand.destroy({ where: { brand_id: id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Marka bulunamadı.' });
        }
        return res.status(200).json({ success: true, message: 'Marka başarıyla silindi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
//ONAY DURUMU 
const getApprovalStatuses = async (req, res) => {
    try {
        const approvals = await ApprovalStatus.findAll();

        return res.status(200).json(approvals);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
const getApprovalStatusById = async (req, res) => {
    const { id } = req.params;
    try {
        const approvalStatus = await ApprovalStatus.findByPk(id);
        if (!approvalStatus) {
            return res.status(404).json({ success: false, message: 'Bulunamadı.' });
        }
        return res.status(200).json(approvalStatus);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

//ürün onay, yorum onay, soru cevap onay
const getProductComments = async (req, res) => {
    try {
        const comments = await ProductComment.findAll({
            include: [
                {
                    model: User
                },
                {
                    model: sellerProduct,
                    include: [
                        {
                            model: Product
                        }
                    ]
                },
                {
                    model: ApprovalStatus
                }
            ]
        })

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    }
}
const getSellerProducts = async (req, res) => {
    try {
        const sellerProducts = await sellerProduct.findAll({
            include: [
                {
                    model: Seller
                },
                {
                    model: Product
                },
                {
                    model: ApprovalStatus
                }
            ]
        })
        return res.status(200).json(sellerProducts);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getProductQuestions = async (req, res) => {
    try {
        const questions = await productQuestion.findAll({
            include: [
                {
                    model: Product
                },
                {
                    model: Seller
                },
                {
                    model: User
                },
                {
                    model: ApprovalStatus
                }
            ]
        })
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateApprovalStatus = async (model, idField, req, res) => {
    try {
        const { id, approval_status_id } = req.params;

        const admin = await Admin.findOne({ where: { username: req.user.username } });
        const record = await model.findOne({ where: { [idField]: id } });

        if (!record) {
            return res.status(404).json({ success: false, message: "Kayıt bulunamadı." });
        }

        record.approval_status_id = approval_status_id;
        record.admin_id = admin.admin_id;
        await record.save();

        return res.status(200).json({ success: true, message: "Onay durumu başarıyla güncellendi." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




module.exports = {
    login, register, listAdmins,
    getProducts, getProductsById, createProduct, editProduct, deleteProduct, searchProduct,
    getCategories, getCategoriesById, createCategory, editCategory, deleteCategory,
    getUsers, getUsersById, createUser, editUser, deleteUser,
    getOrders, getOrderDetailsById, updateOrder,
    getSellers, getSellerById, createSeller, editSeller, deleteSeller,
    getBrands, getBrandById, createBrand, editBrand, deleteBrand, getApprovalStatuses, getApprovalStatusById,
    updateApprovalStatus, getProductComments, getProductQuestions, getSellerProducts

};