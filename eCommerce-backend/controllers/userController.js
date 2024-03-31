const bcrypt = require("bcrypt"); // Şifreleri güvenli bir şekilde saklamak için bcrypt kütüphanesini kullanıyoruz
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { errors } = require("ethers");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const sellerProduct = require("../models/sellerProduct");
const Seller = require("../models/seller");
const Product = require("../models/product");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // kullanıcı adı ile ara
    const user = await User.findOne({ where: { email } });

    // Kullanıcı bulunamazsa hata mesajı dön
    if (!user) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı veya şifre hatalı." });
    }

    // Kullanıcının şifresini doğrula
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Şifre eşleşmiyorsa hata mesajı dön
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı veya şifre hatalı." });
    }

    // Token oluştur (token içinde yalnızca gerekli ve güvenli bilgileri sakla)
    const tokenPayload = { id: user.user_id, email: user.email, role: "user" };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "100y", // Token süresi (örneğin 1 saat)
    });

    // Başarılı giriş yanıtı ve token dön
    return res
      .status(200)
      .json({ message: "Giriş başarılı.", token, role: "user" });
  } catch (error) {
    // Hata yakalama ve loglama
    console.error("Giriş sırasında bir hata oluştu:", error);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
};
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu e-posta zaten kullanılıyor." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    // Token oluştur
    const tokenPayload = {
      id: newUser.id,
      username: newUser.username,
      role: "user",
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token süresi (örneğin 1 saat)
    });

    return res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu.",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Kullanıcı kaydı sırasında bir hata oluştu:", error);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
};
const listUsers = async (req, res) => {
  try {
    // Tüm admin kullanıcılarını veritabanından çek
    const users = await User.findAll();

    // Başarılı yanıtı dön
    return res.status(200).json(users);
  } catch (error) {
    // Hata durumunda hata mesajını döndür
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateUserDetail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı Bulunamadı' });
    }

    await user.update();

    return res.status(200).json({ success: true, message: 'Bilgileriniz güncellendi' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
//SEPET İŞLEMLERİ
const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });

    if (!cart) {
      await Cart.create({
        user_id: user.user_id
      })
    }
    const item = await CartItem.findOne({ where: { cart_id: cart.cart_id, seller_product_id: productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.cart_id,
        seller_product_id: productId,
        quantity: quantity
      })
    }

    return res.status(200).json({ success: false, message: 'Ürün sepete eklendi.' })

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const deleteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı.' });
    }

    const item = await CartItem.findOne({ where: { cart_id: cart.cart_id, seller_product_id: productId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ürün sepetinizde bulunamadı.' });
    }

    await item.destroy();

    return res.status(200).json({ success: true, message: 'Ürün sepetten silindi.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const increaseItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı.' });
    }

    const item = await CartItem.findOne({ where: { cart_id: cart.cart_id, seller_product_id: productId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ürün sepetinizde bulunamadı.' });
    }

    // Eğer miktar 1'den büyükse, miktarı bir azalt
    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
      return res.status(200).json({ success: true, message: 'Ürün miktarı azaltıldı.' });
    } else {
      // Miktar 1 ise, ürünü sepetten tamamen çıkar
      await item.destroy();
      return res.status(200).json({ success: true, message: 'Ürün sepetten silindi.' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const getCartItems = async (req, res) => {
  try {
    // Öncelikle kullanıcının email adresini kullanarak kullanıcıyı bulun
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Kullanıcıya ait sepeti bulun
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı.' });
    }

    // Sepete ait ürünleri çeken bir sorgu yapın
    const items = await CartItem.findAll({
      where: { cart_id: cart.cart_id },
      include: [{
        model: sellerProduct, // Bu, ürün bilgilerini de çekmek istiyorsanız kullanılabilir 
        include: [{
          model: Seller,
        },
        {
          model: Product
        }]
      }]
    });

    // Sepetteki ürünleri döndür
    return res.status(200).json(items);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


module.exports = {
  login, register, listUsers, getUserDetails, updateUserDetail,
  addItem, deleteItem, increaseItem, getCartItems
};
