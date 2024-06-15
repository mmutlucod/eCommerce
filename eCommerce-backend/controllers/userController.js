const bcrypt = require("bcrypt"); // Şifreleri güvenli bir şekilde saklamak için bcrypt kütüphanesini kullanıyoruz
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const sellerProduct = require("../models/sellerProduct");
const Seller = require("../models/seller");
const Product = require("../models/product");
const Brand = require("../models/Brand");
const Category = require("../models/category");
const ProductList = require("../models/productList");
const ProductListItems = require("../models/productListItems");
const Address = require("../models/address");
const Order = require("../models/order");
const orderStatus = require("../models/orderStatus");
const OrderItem = require("../models/orderItem");
const UserFavoriteProduct = require("../models/userFavoriteProduct");
const ProductComment = require("../models/productComment");
const ApprovalStatus = require("../models/approval_status");
const SellerComment = require("../models/sellerComment");
const Follow = require("../models/follow");
const Return = require("../models/return");
const ReturnItem = require("../models/returnItem");
const productQuestion = require("../models/productQuestion");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../utility/db");
const productImage = require("../models/productImage");

//KULLANICI İŞLEMLERİ 

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
    const tokenPayload = { id: user.id, email: user.email, role: "user" };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30m", // Token süresi (örneğin 1 saat)
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

    const cart = await Cart.create({
      user_id: newUser.user_id
    });

    // Token oluştur
    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      role: "user",
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30m", // Token süresi (örneğin 1 saat)
    });

    return res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu.",
      token,
      role: "user"
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
    const { currentPassword, newPassword, confirmPassword, email, phone, ...updateData } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı Bulunamadı' });
    }

    // E-posta ve telefon kontrolü
    const emailExists = await User.findOne({ where: { email: email, user_id: { [Op.ne]: user.user_id } } });
    const phoneExists = await User.findOne({ where: { phone: phone, user_id: { [Op.ne]: user.user_id } } });

    if (emailExists && phoneExists) {
      return res.status(400).json({ success: false, message: 'E-posta ve Telefon zaten kullanılıyor.' });
    }

    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Bu E-posta zaten kullanılıyor.' });
    }

    if (phoneExists) {
      return res.status(400).json({ success: false, message: 'Bu Telefon zaten kullanılıyor.' });
    }

    // Şifre güncelleme işlemi yapılıyor mu kontrolü
    if (currentPassword && newPassword && confirmPassword) {
      // Mevcut şifreyi doğrula
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mevcut şifre yanlış.' });
      }

      // Yeni şifre mevcut şifre ile aynı mı kontrolü
      const isSameAsCurrentPassword = await bcrypt.compare(newPassword, user.password);
      if (isSameAsCurrentPassword) {
        return res.status(400).json({ success: false, message: 'Yeni şifre eski şifreniz olamaz.' });
      }

      // Yeni şifreler uyuşuyor mu kontrolü
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Yeni şifreler eşleşmiyor.' });
      }

      // Yeni şifreyi hashle ve güncelle
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Kullanıcı bilgilerini güncelle
    await user.update({ ...updateData, email, phone });

    // Yeni bir token oluştur
    const payload = {
      id: user.id,
      email: user.email,
      // Diğer gerekli kullanıcı bilgileri
    };

    const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Bilgileriniz güncellendi.',
      token: newToken, // Yeni token'ı yanıtla birlikte döndür
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


//SEPET İŞLEMLERİ

const addItem = async (req, res) => {
  try {
    const { sellerProductId, quantity } = req.body;

    // Kullanıcıyı doğrula
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Satıcı ürününü ve ilişkili ürün bilgilerini kontrol et
    const sp = await sellerProduct.findByPk(sellerProductId, {
      include: [Product]
    });
    if (!sp) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Maksimum miktarları belirle
    const maxBuy = sp.product.max_buy;
    const stock = sp.stock;

    // Kullanıcının sepetini bul veya oluştur
    let cart = await Cart.findOne({ where: { user_id: user.user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id: user.user_id });
    }

    // Sepet öğesini bul veya oluştur
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        seller_product_id: sellerProductId,
      },
    });

    // Sepet öğesi zaten varsa, miktarı artır
    if (cartItem) {
      let potentialNewQuantity = cartItem.quantity + quantity;

      if (potentialNewQuantity > maxBuy) {
        return res.status(400).json({ success: false, message: `Maksimum satın alma miktarına (${maxBuy}) ulaştınız.` });
      }

      if (potentialNewQuantity > stock) {
        return res.status(400).json({ success: false, message: `Stokta yeterli ürün bulunmamaktadır. Maksimum eklenebilir miktar: ${stock - cartItem.quantity}` });
      }

      cartItem.quantity = potentialNewQuantity;
      await cartItem.save();
      return res.status(200).json({ success: true, message: 'Ürün miktarı güncellendi.' });
    } else {
      // Sepet öğesi yoksa, yeni bir tane oluştur
      if (quantity > maxBuy) {
        return res.status(400).json({ success: false, message: `Maksimum satın alma miktarına (${maxBuy}) ulaştınız.` });
      }

      if (quantity > stock) {
        return res.status(400).json({ success: false, message: `Stokta yeterli ürün bulunmamaktadır. Maksimum eklenebilir miktar: ${stock}` });
      }

      await CartItem.create({
        cart_id: cart.cart_id,
        seller_product_id: sellerProductId,
        quantity: quantity,
      });
      return res.status(200).json({ success: true, message: 'Ürün sepete eklendi.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { sellerProductId, quantity } = req.body;

    // Kullanıcıyı doğrula
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Satıcı ürününü ve ilişkili ürün bilgilerini kontrol et
    const sp = await sellerProduct.findByPk(sellerProductId, {
      include: [Product]
    });
    if (!sp) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Maksimum miktarları belirle
    const maxBuy = sp.product.max_buy;
    const stock = sp.stock;

    // Kullanıcının sepetini bul veya oluştur
    let cart = await Cart.findOne({ where: { user_id: user.user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id: user.user_id });
    }

    // Sepet öğesini bul veya oluştur
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        seller_product_id: sellerProductId,
      },
    });

    if (quantity <= 0) {
      // Eğer yeni miktar 0 veya daha az ise, öğeyi sepetten çıkar
      if (cartItem) {
        await cartItem.destroy();
        return res.status(200).json({ success: true, message: 'Ürün sepetten silindi.' });
      } else {
        return res.status(200).json({ success: true, message: 'Ürün sepetinizde zaten bulunmamaktadır.' });
      }
    } else {
      // Sepet öğesi zaten varsa, miktarı güncelle
      if (cartItem) {
        let potentialNewQuantity = quantity;

        if (potentialNewQuantity > maxBuy) {
          return res.status(400).json({ success: false, message: `Maksimum satın alma miktarına (${maxBuy}) ulaştınız.` });
        }

        if (potentialNewQuantity > stock) {
          return res.status(400).json({ success: false, message: `Stokta yeterli ürün bulunmamaktadır. Maksimum eklenebilir miktar: ${stock - cartItem.quantity}` });
        }

        cartItem.quantity = potentialNewQuantity;
        await cartItem.save();
        return res.status(200).json({ success: true, message: 'Ürün miktarı güncellendi.' });
      } else {
        // Sepet öğesi yoksa, yeni bir tane oluştur
        if (quantity > maxBuy) {
          return res.status(400).json({ success: false, message: `Maksimum satın alma miktarına (${maxBuy}) ulaştınız.` });
        }

        if (quantity > stock) {
          return res.status(400).json({ success: false, message: `Stokta yeterli ürün bulunmamaktadır. Maksimum eklenebilir miktar: ${stock}` });
        }

        await CartItem.create({
          cart_id: cart.cart_id,
          seller_product_id: sellerProductId,
          quantity: quantity,
        });
        return res.status(200).json({ success: true, message: 'Ürün sepete eklendi.' });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



const deleteItem = async (req, res) => {
  try {
    const { cartItemId } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı.' });
    }

    const item = await CartItem.findOne({ where: { id: cartItemId } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ürün sepetinizde bulunamadı.' });
    }

    await item.destroy();

    return res.status(200).json({ success: true, message: 'Ürün sepetten silindi.' });

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
          model: Product,
          include: [{
            model: Brand
          },
          {
            model: productImage
          }]
        }]
      }]
    });

    // Sepetteki ürünleri döndür
    return res.status(200).json(items);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const clearCart = async (req, res) => {
  try {
    // Kullanıcının oturum bilgilerinden email adresini al
    const user = await User.findOne({ where: { email: req.user.email } });

    // Kullanıcı bulunamazsa hata ver
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Kullanıcıya ait sepeti bul
    const cart = await Cart.findOne({ where: { user_id: user.user_id } });

    // Sepet bulunamazsa hata ver
    if (!cart) {
      res.status(408).json({ success: false, message: 'Sepet bulunamadı.' });
    }

    // Sepete ait tüm ürünleri bul
    const items = await CartItem.findAll({ where: { cart_id: cart.cart_id } });

    // Her bir ürünü döngü ile sil
    for (const item of items) {
      await item.destroy();
    }

    // Başarılı sonuç dön
    return res.status(200).json({ success: true, message: 'Sepetiniz başarıyla boşaltıldı.' });

  } catch (error) {
    // Hata durumunda hatayı dön
    return res.status(500).json({ success: false, message: error.message });
  }
}


//LİSTE İŞLEMLERİ
const getLists = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    const lists = await ProductList.findAll({ where: { user_id: user.user_id } });

    return res.status(200).json(lists);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const createList = async (req, res) => {
  try {
    const { listName } = req.body;
    // isPublic değerini boolean olarak al, undefined ise varsayılan olarak 0 kullan
    const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : 0;
    const user = await User.findOne({ where: { email: req.user.email } });

    // Slug oluştur. Eğer liste herkese açıksa, benzersiz bir slug oluşturur.
    let slug = null;
    if (isPublic) {
      // Slug oluşturma. Gerçek uygulamalarda daha karmaşık ve benzersiz bir slug oluşturmayı düşünebilirsiniz.
      slug = listName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    }

    // Aynı isimde bir liste olup olmadığını kontrol et
    const existingList = await ProductList.findOne({
      where: {
        user_id: user.user_id,
        list_name: listName,
        // is_public ve slug kontrolünü burada yapmayabilirsiniz çünkü isim benzersizliği yeterli olacaktır.
      },
    });

    if (existingList) {
      // Liste zaten varsa, hata mesajı gönder
      return res.status(409).json({ success: false, message: 'Bu isimde bir liste zaten var.' });
    }

    // Yeni listeyi oluştur
    const newList = await ProductList.create({
      user_id: user.user_id,
      list_name: listName,
      is_public: isPublic,
      slug: slug, // Slug'ı veritabanına kaydet
    });

    return res.status(200).json({ success: true, message: 'Liste başarıyla oluşturuldu.', list: newList });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });

    // Listeyi bul
    const list = await ProductList.findOne({
      where: {
        user_id: user.user_id,
        list_id: listId,
      },
    });

    if (!list) {
      return res.status(404).json({ success: false, message: 'Liste bulunamadı.' });
    }

    // Listeyi silmeden önce, ilişkili tüm ürünleri sil
    await ProductListItems.destroy({ where: { list_id: listId } });

    // Liste silme işlemi
    await list.destroy();

    return res.status(200).json({ success: true, message: 'Liste başarıyla silindi.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const updateList = async (req, res) => {
  try {
    const { listId } = req.params; // URL'den listId'yi al
    const { isPublic } = req.body; // istek gövdesinden isPublic değerini al

    // İlgili kullanıcıyı bul
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    // Güncellenecek listeyi bul
    const list = await ProductList.findOne({
      where: {
        user_id: user.user_id,
        list_id: listId,
      },
    });

    if (!list) {
      // Liste bulunamazsa, hata mesajı gönder
      return res.status(404).json({ success: false, message: 'Güncellenecek liste bulunamadı.' });
    }

    // isPublic durumuna göre slug güncelleme
    let updateFields = {
      is_public: isPublic,
    };

    if (isPublic) {
      // Eğer liste herkese açık yapılıyorsa, yeni bir slug oluştur
      const slug = list.list_name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
      updateFields.slug = slug;
    } else {
      // Eğer liste herkese kapalı yapılıyorsa, slug'ı sil
      updateFields.slug = null;
    }

    // Listeyi güncelle
    await list.update(updateFields);

    return res.status(200).json({ success: true, message: 'Liste başarıyla güncellendi.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const getPublicListItemsBySlug = async (req, res) => {
  const { slug } = req.params;

  const list = await ProductList.findOne({
    where: {
      slug: slug,
      is_public: true
    },
    include: [{
      model: ProductListItems,
      include: [Product]
    }]
  });

  if (!list) {
    return res.status(404).json({ success: false, message: 'Liste bulunamadı.' });
  }

  // Liste ve ürünlerini döndür
  return res.json({ success: true, items: list.ProductListItems });
};
//LİSTE İTEM İŞLEMLERİ
const addItemToList = async (req, res) => {
  try {
    const { listId, productId } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });

    let targetListId = listId;

    if (!listId) {
      // "Beğendiklerim" listesini bul veya oluştur
      const favoritesList = await ProductList.findOrCreate({
        where: {
          user_id: user.user_id,
          list_name: 'Beğendiklerim',
        },
        defaults: { // findOrCreate metodunun "create" kısmı için varsayılan değerler
          user_id: user.user_id,
          list_name: 'Beğendiklerim',
        }
      });

      targetListId = favoritesList[0].dataValues.list_id; // findOrCreate döndürdüğü array'in ilk elemanındaki list_id'yi kullan
    }

    // Aynı ürünün aynı listeye eklenip eklenmediğini kontrol et
    const existingItem = await ProductListItems.findOne({
      where: {
        list_id: targetListId,
        product_id: productId,
      },
    });

    if (!existingItem) {
      // Ürün zaten listede yoksa, ekleyebiliriz
      await ProductListItems.create({
        list_id: targetListId,
        product_id: productId,
      });
    }

    return res.status(200).json({ success: true, message: 'Ürün listeye başarıyla eklendi.' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const getItemsByListId = async (req, res) => {
  try {
    const { listId } = req.params;
    const items = await ProductListItems.findAll({
      where: { list_id: listId },
      include: [{
        model: Product
      }]
    });

    const itemsWithBestPrice = await Promise.all(items.map(async (item) => {
      // Her bir ürün için en uygun fiyatlı SellerProduct'ı bul
      const bestPriceSellerProduct = await sellerProduct.findOne({
        where: {
          product_id: item.product.product_id,
          is_active: 1
        },
        order: [['price', 'ASC']],
        limit: 1
      });

      // Ürün bilgisi ile en uygun fiyatlı satıcı ürününü birleştir
      return {
        ...item.toJSON(),
        BestPriceSellerProduct: bestPriceSellerProduct
      };
    }));

    return res.json({ success: true, items: itemsWithBestPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const removeItemFromList = async (req, res) => {
  try {
    const { listId, productId } = req.body; // listId ve productId, istekten alınır

    // Ürünün varlığını kontrol et
    const item = await ProductListItems.findOne({
      where: {
        list_id: listId,
        product_id: productId,
      },
    });

    if (item) {
      // Ürün bulunursa, listeden sil
      await item.destroy();
      return res.status(200).json({ success: true, message: 'Ürün listeden başarıyla silindi.' });
    } else {
      // Ürün listeye eklenmemişse, bir hata mesajı gönder
      return res.status(404).json({ success: false, message: 'Listede bu ürün bulunamadı.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//ADRES İŞLEMLERİ
const getAddresses = async (req, res) => {
  try {

    // Veritabanında bu email adresine sahip kullanıcıyı buluyoruz
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    // Kullanıcıya ait adresleri buluyoruz
    const addresses = await Address.findAll({
      where: { user_id: user.user_id, is_deleted: 0 } // user.id, bulunan kullanıcının ID'sidir
    });

    return res.status(200).json(addresses);
  } catch (error) {
    // Bir hata oluşursa, hatayı döndürüyoruz
    return res.status(500).json({ success: false, message: error.message });
  }
}
const createAddress = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }
    // Yeni adresi oluştur
    const newAddress = await Address.create({
      ...req.body,
      user_id: user.user_id,
      is_deleted: 0
    });

    return res.status(201).json({ success: true, message: "Adres başarıyla eklendi.", address: newAddress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params; // URL'den adres ID'si alınır
    const user = await User.findOne({ where: { email: req.user.email } });
    const updatedData = req.body; // Güncellenecek adres bilgileri

    // Adresi ve adresin kullanıcıya ait olup olmadığını kontrol et
    const address = await Address.findOne({
      where: { address_id: addressId, user_id: user.user_id }
    });

    if (!address) {
      return res.status(404).json({ success: false, message: "Adres bulunamadı veya erişim yetkiniz yok." });
    }

    // Mevcut adresin is_deleted alanını 1 yap
    await address.update({ is_deleted: 1 });


    return res.status(200).json({ success: true, message: 'Adres başarıyla güncellendi' });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params; // URL'den adres ID'si alınır
    const user = await User.findOne({ where: { email: req.user.email } });

    // Adresi ve adresin kullanıcıya ait olup olmadığını kontrol et
    const address = await Address.findOne({
      where: { address_id: addressId, user_id: user.user_id, is_deleted: false }
    });

    if (!address) {
      return res.status(404).json({ success: false, message: "Adres bulunamadı veya erişim yetkiniz yok." });
    }

    // Adresi silinmiş olarak işaretle
    address.is_deleted = true;
    await address.save();

    return res.status(200).json({ success: true, message: "Adres başarıyla silindi." });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//SİPARİŞ İŞLEMLERİ
const getorders = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    const orders = await Order.findAll(
      {
        where: { user_id: user.user_id },
        include: [
          {
            model: orderStatus
          },
          {
            model: User
          },
          {
            model: Address
          }
        ]
      });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


const getorder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });
    const orders = await Order.findOne(
      {
        where: { order_id: orderId },
        include: [
          {
            model: orderStatus
          },
          {
            model: User
          },
          {
            model: Address
          }
        ]
      });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderItems = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: sellerProduct,
          include: [
            { model: Seller },
            {
              model: Product,
              include: [
                {
                  model: productImage
                }
              ]
            },
          ],
        },
        { model: orderStatus },
      ],
    });

    if (orderItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Siparişe ait ürün bulunamadı.",
      });
    }

    // Eğer siparişin durumu 4 ise, tüm sipariş iptal edilmiş demektir
    const isOrderCancelled =
      orderItems[0].orderStatus &&
      orderItems[0].orderStatus.order_status_id === 5;

    let totalRefundAmount = 0;
    let remainingItemsCount = 0;

    if (isOrderCancelled) {
      // Sipariş tamamen iptal edildiyse, tüm ürünler için iade tutarını hesapla
      orderItems.forEach(item => {
        totalRefundAmount += item.quantity * item.price;
      });
      remainingItemsCount = 0; // Tüm sipariş iptal edildiği için kalan ürün yok
    } else {
      // Sipariş kısmen iptal edildiyse, iptal edilen ve kalan ürünleri hesapla
      orderItems.forEach(item => {
        if (item.canceled_quantity > 0) {
          totalRefundAmount += item.canceled_quantity * item.price;
        }
        if (item.quantity > item.canceled_quantity) {
          remainingItemsCount += 1;
        }
      });
    }

    const response = {
      orderItems: orderItems,
      refundInfo: isOrderCancelled
        ? `Siparişiniz tamamen iptal edilmiştir. Toplam iade edilecek tutar: ${totalRefundAmount} TL.`
        : {
          totalRefundAmount: totalRefundAmount,
          remainingItemsCount: remainingItemsCount,
          canceledItemsCount: orderItems.length - remainingItemsCount,
          refundMessage: `${remainingItemsCount} ürününüzden ${orderItems.length - remainingItemsCount} tanesi iptal edildi. ${totalRefundAmount} TL iade edilecektir.`,
        },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
const cancelOrderItem = async (req, res) => {
  try {
    const { orderItemId, cancelQuantity } = req.body;

    // Sipariş öğesini bul
    const orderItem = await OrderItem.findByPk(orderItemId);

    if (!orderItem) {
      return res.status(404).json({ success: false, message: "Sipariş öğesi bulunamadı." });
    }

    // İptal edilecek miktarın mevcut sipariş miktarını aşmadığını kontrol et
    if (cancelQuantity > orderItem.quantity) {
      return res.status(400).json({ success: false, message: "İptal edilecek miktar, mevcut sipariş miktarından fazla olamaz." });
    }

    // İptal edilen miktarı güncelle
    const newCanceledQuantity = (orderItem.canceled_quantity || 0) + cancelQuantity;
    await orderItem.update({ canceled_quantity: newCanceledQuantity });

    // Başarılı yanıt dön
    return res.status(200).json({ success: true, message: "Sipariş öğesi başarıyla iptal edildi.", orderItem: orderItem });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;
    // Kullanıcıyı doğrulayın
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Kullanıcının sepetini sorgulayın
    const cart = await Cart.findOne({
      where: { user_id: user.user_id },
      include: [{ model: CartItem, include: [sellerProduct] }]
    });
    if (!cart || !cart.cartItems.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Siparişin toplam fiyatını hesaplayın
    const total_price = cart.cartItems.reduce((accumulator, item) => {
      const itemTotal = item.quantity * item.sellerProduct.price;
      return accumulator + itemTotal;
    }, 0);

    // Yeni siparişi oluşturun
    const order = await Order.create({
      user_id: user.user_id,
      address_id: addressId,
      order_date: new Date(),
      total_price: total_price,
      order_status_id: 1
    });

    // Sipariş öğelerini oluşturun ve stoktan düşürün
    const updateStockPromises = cart.cartItems.map(async item => {
      const orderItem = await OrderItem.create({
        order_id: order.order_id,
        seller_product_id: item.seller_product_id,
        quantity: item.quantity,
        order_status_id: 1
      });

      // Stoktan düşür
      const sp = await sellerProduct.findByPk(item.seller_product_id);
      if (sp && sp.stock >= item.quantity) {
        await sp.update({
          stock: sp.stock - item.quantity
        });
      } else {
        // Stokta yeterli ürün yoksa hata döndür
        throw new Error('Insufficient stock for product ID: ' + item.seller_product_id);
      }

      return orderItem;
    });

    await Promise.all(updateStockPromises);

    // Sepeti temizleyin (opsiyonel)
    await CartItem.destroy({ where: { cart_id: cart.cart_id } });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body; // İptal edilecek siparişin ID'si

    // Siparişi bul
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Sipariş bulunamadı." });
    }

    // Siparişin iptal edilebilir durumda olup olmadığını kontrol et (örneğin, kargoya verilmemiş)
    if (order.order_status_id >= 3) { // Burada 3, 4 ve 5, kargoya verilmiş veya iptal edilmiş siparişleri temsil ediyor
      return res.status(400).json({ success: false, message: "Sipariş zaten kargoya verilmiş veya iptal edilmiş durumda ve iptal edilemez." });
    }

    // Sipariş durumunu 'iptal edildi' olarak güncelle
    await order.update({ order_status_id: 5 });

    return res.status(200).json({ success: true, message: "Sipariş başarıyla iptal edildi." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//FAVORİ İŞLEMLERİ
const getFavorites = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    favorites = await UserFavoriteProduct.findAll({
      where: { user_id: user.user_id },
      include: [
        {
          model: Product,
          include: [
            {
              model: Brand
            },
            {
              model: productImage
            },
            {
              model: sellerProduct
            }
          ]
        },
        {
          model: User
        }
      ]
    });
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const addFavoriteItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });

    const favoriteProduct = await UserFavoriteProduct.findOne({ where: { user_id: user.user_id, product_id: productId } });

    if (favoriteProduct) {
      return res.status(404).json({ success: false, message: 'Bu ürün zaten favorilerde mevcut!' });
    }

    await UserFavoriteProduct.create({
      user_id: user.user_id,
      product_id: productId
    })

    return res.status(200).json({ success: true, message: 'Ürün favorilere eklendi.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const deleteFavoriteItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const favorite = await UserFavoriteProduct.findOne({
      where: {
        user_id: user.user_id,
        product_id: productId
      }
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite item not found' });
    }

    await favorite.destroy();

    return res.status(200).json({ success: true, message: 'Product removed from favorites' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ÜRÜN DEĞERLENDİRME İŞLEMLERİ 

// (kullanıcının yorumları)
const getProductCommentsByUser = async (req, res) => {
  try {
    // Kullanıcıyı doğrulayın
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    const productComments = await ProductComment.findAll({
      where: {
        user_id: user.user_id,
        is_deleted: 0,
      },
      include: [
        {
          model: ApprovalStatus,
        },
        {
          model: User,
          attributes: ['name', 'surname']
        },
        // sellerProduct modelini doğrudan Product modeli ile değiştir
        {
          model: sellerProduct,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Brand,
                }
              ]
            }
          ],

        }
      ],
      order: [['comment_date', 'DESC']] // Yorumları yorum tarihine göre sırala
    });

    // Kullanıcı adlarını formatlayarak güncelle
    const formattedComments = productComments.map(comment => {
      if (comment.is_public === 0) {
        comment.user.name = formatUserName(comment.user.name, comment.is_public);
        comment.user.surname = formatUserName(comment.user.surname, comment.is_public);
        // Soyadını da formatlamak için benzer bir işlem yapabilirsiniz.
      }
      return comment;
    });

    return res.status(200).json(formattedComments);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
// (ürüne gelen yorumlar)
const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params; // Ürün ID'si, genellikle bir route parametresi olarak alınır

    const productComments = await ProductComment.findAll({
      where: {
        is_deleted: 0,
        approval_status_id: 1
      },
      include: [
        {
          model: ApprovalStatus, // Bu modelin ProductComment ile ilişkilendirilmiş olması gerekiyor
        },
        {
          model: User, // Kullanıcı modeli, ProductComment ile ilişkilendirilmiş olmalı
        },
        {
          model: sellerProduct,
          required: true,
          include: [{
            model: Product,
            where: {
              product_id: productId
            },
            include: [
              {
                model: Brand, // Brand modeli, Product ile ilişkilendirilmiş olmalı
              }
            ],
          }]
        }
      ],
      order: [['comment_date', 'DESC']] // createdAt yerine modelde tanımlı olan comment_date kullanılır
    });


    return res.status(200).json(productComments);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const createProductComments = async (req, res) => {
  try {
    const { sellerProductId, comment, rating } = req.body;
    const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : 1;

    // Oturumdan kullanıcı ID'sini al
    const user = await User.findOne({ where: { email: req.user.email } });

    // İlgili sellerProduct'ı bul
    const sellerProductInstance = await sellerProduct.findOne({ where: { seller_product_id: sellerProductId } });
    if (!sellerProductInstance) {
      return res.status(404).json({ success: false, message: "Satıcı ürünü bulunamadı." });
    }

    // Bu product_id için kullanıcının daha önce yorum yapıp yapmadığını kontrol et
    const existingComment = await ProductComment.findOne({
      include: [{
        model: sellerProduct,
        where: { product_id: sellerProductInstance.product_id },
        attributes: []
      }],
      where: { user_id: user.user_id },
    });

    if (existingComment) {
      return res.status(409).json({ success: false, message: "Bu ürün için zaten bir yorumunuz var." });
    }

    // Yeni yorum oluştur
    const newComment = await ProductComment.create({
      user_id: user.user_id,
      seller_product_id: sellerProductId,
      comment: comment,
      rating: rating,
      is_public: isPublic,
      is_deleted: 0,
      comment_date: new Date(),
      admin_id: 1,
      approval_status_id: 3
    });

    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const updateProductComments = async (req, res) => {
  try {
    const { commentId, isPublic } = req.body; // isPublic
    const user = await User.findOne({ where: { email: req.user.email } });

    // Yalnızca yorumun sahibi is_public değerini güncelleyebilir
    const updated = await ProductComment.update(
      { is_public: isPublic },
      { where: { comment_id: commentId, user_id: user.user_id } }
    );

    if (updated[0] > 0) {
      return res.status(200).json({ success: true, message: "Yorum durumu güncellendi." });
    } else {
      return res.status(404).json({ success: false, message: "Yorum bulunamadı veya güncellenemedi." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const deleteProductComments = async (req, res) => {
  try {
    const { commentId } = req.body; // Silinmek istenen yorumun ID'si
    const user = await User.findOne({ where: { email: req.user.email } });

    // Yalnızca yorumun sahibi yorumu silmek için işaretleyebilir
    const updated = await ProductComment.update(
      { is_deleted: 1 }, // is_deleted alanını 1 olarak güncelle
      { where: { comment_id: commentId, user_id: user.user_id } }
    );

    if (updated[0] > 0) {
      return res.status(200).json({ success: true, message: "Yorum başarıyla silindi." });
    } else {
      return res.status(404).json({ success: false, message: "Yorum bulunamadı veya zaten silinmiş." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//SATICI DEĞERLENDİRME İŞLEMLERİ 

// (kullanıcının yorumları)
const getSellerCommentsByUser = async (req, res) => {
  try {
    // user ID
    const user = await User.findOne({ where: { email: req.user.email } });

    // Satıcıya yapılan yorumları sorgula
    const sellerComments = await SellerComment.findAll({
      where: {
        user_id: user.user_id,
        is_deleted: 0 // Silinmemiş yorumları filtrele
      },
      include: [
        {
          model: User, // Yorumu yapan kullanıcı
          attributes: ['id', 'name', 'surname'] // Yalnızca belirli kullanıcı bilgilerini dahil et
        },
        {
          model: ApprovalStatus, // Yorumun onay durumu
        }
      ],
      order: [['createdAt', 'DESC']] // Yorumları oluşturulma tarihine göre sırala
    });

    // İsteğe bağlı olarak kullanıcı adını formatlayabilirsiniz
    const formattedComments = sellerComments.map(comment => {
      if (comment.is_public === 0) {
        comment.User.name = formatUserName(comment.User.name, comment.is_public);
        comment.User.surname = formatUserName(comment.User.surname, comment.is_public);
        // İsteğe bağlı olarak, kullanıcı soyadını da formatlayabilirsiniz
      }
      return comment;
    });

    return res.status(200).json(formattedComments);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
// (satıcıya yapılan tüm yorumlar)
const getSellerComments = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Satıcıya yapılan yorumları getir
    const sellerComments = await SellerComment.findAll({
      where: { seller_id: sellerId, is_public: 1 },
      include: [{
        model: User,
        attributes: ['name', 'username', 'email'] // İsteğe bağlı: kullanıcı adı ve email dışındaki bilgileri gizle
      }]
    });

    if (!sellerComments) {
      return res.status(404).json({ success: false, message: "Yorumlar bulunamadı." });
    }

    return res.status(200).json({ success: true, comments: sellerComments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const createSellerComment = async (req, res) => {
  try {
    const { sellerId, comment, rating } = req.body;
    const isPublic = req.body.isPublic !== undefined ? req.body.isPublic : 1;

    // Kullanıcıyı doğrula
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    // Satıcıyı kontrol et
    const seller = await Seller.findOne({ where: { seller_id: sellerId } });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Satıcı bulunamadı." });
    }

    // Yeni satıcı yorumu oluştur
    const newSellerComment = await SellerComment.create({
      user_id: user.user_id,
      seller_id: sellerId,
      comment: comment,
      rating: rating,
      is_public: isPublic,
      comment_date: new Date()
    });

    return res.status(201).json({ success: true, sellerComment: newSellerComment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const updateSellerComments = async (req, res) => {
  try {
    const { commentId, isPublic } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });

    // Yalnızca yorumun sahibi is_public değerini güncelleyebilir
    const updated = await SellerComment.update(
      { is_public: isPublic },
      { where: { comment_id: commentId, user_id: user.user_id } }
    );

    if (updated[0] > 0) {
      return res.status(200).json({ success: true, message: "Satıcı yorumu durumu güncellendi." });
    } else {
      return res.status(404).json({ success: false, message: "Satıcı yorumu bulunamadı veya güncellenemedi." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const deleteSellerComments = async (req, res) => {
  try {
    const { commentId } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });

    // Yalnızca yorumun sahibi yorumu silmek için işaretleyebilir
    const updated = await SellerComment.update(
      { is_deleted: 1 },
      { where: { comment_id: commentId, user_id: user.user_id } }
    );

    if (updated[0] > 0) {
      return res.status(200).json({ success: true, message: "Satıcı yorumu başarıyla silindi." });
    } else {
      return res.status(404).json({ success: false, message: "Satıcı yorumu bulunamadı veya zaten silinmiş." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// SATICI TAKİP İŞLEMLERİ

const toggleFollowSeller = async (req, res) => {
  try {
    const { sellerId } = req.body; // Kullanıcı ve satıcı ID'leri, istek gövdesinden alınır
    const user = await User.findOne({ where: { email: req.user.email } });

    // İlk olarak, mevcut takip ilişkisini kontrol et
    const existingFollow = await Follow.findOne({
      where: { user_id: user.user_id, seller_id: sellerId }
    });

    if (existingFollow) {
      // Eğer takip ilişkisi varsa, takipten çıkar (ilişkiyi sil)
      await existingFollow.destroy();
      return res.status(200).json({ success: true, message: "Satıcı takipten çıkarıldı." });
    } else {
      // Eğer takip ilişkisi yoksa, yeni bir takip ilişkisi oluştur
      await Follow.create({ user_id: user.user_id, seller_id: sellerId });
      return res.status(201).json({ success: true, message: "Satıcı takip edilmeye başlandı." });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
const checkFollowStatus = async (req, res) => {
  try {

    const user = await User.findOne({ where: { email: req.user.email } });
    const { sellerId } = req.params; // Kullanıcı ve satıcı ID'leri, sorgu parametreleri olarak alınır

    const follow = await Follow.findOne({
      where: {
        user_id: user.user_id,
        seller_id: sellerId
      }
    });

    return res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
}
const getFollowedSellers = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    // Kullanıcının takip ettiği satıcıları sorgula
    const followedSellers = await Follow.findAll({
      where: { user_id: user.user_id },
      include: [{
        model: Seller, // Takip edilen satıcıların bilgileri
        required: true
      }]
    });

    if (!followedSellers.length) {
      return res.status(404).json({ success: false, message: "Takip edilen satıcı bulunamadı." });
    }

    // Sadece satıcı bilgilerini döndürmek için bir map işlemi
    const sellersInfo = followedSellers.map(follow => follow.seller);

    return res.status(200).json({ success: true, followedSellers: sellersInfo });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// İADE İŞLEMLERİ

const createReturnRequest = async (req, res) => {
  const { orderId, reason, returnItems } = req.body; // `returnItems` her bir iade edilecek ürün için { orderItemId, quantity, condition } bilgilerini içeren bir array.

  try {
    const existingReturn = await Return.findOne({
      where: {
        order_id: orderId // Örneğin, kullanıcı ID'sini ilişkilendirdiğinizi varsayıyoruz
      }
    });

    // Eğer aynı `orderId` ve `userId` ile bir kayıt varsa, yeni bir iade talebi oluşturmayı reddet
    if (existingReturn) {
      return res.status(409).json({ success: false, message: "Bu sipariş için zaten bir iade talebi mevcut." });
    }

    // Eğer mevcut bir iade talebi yoksa, yeni bir iade talebi oluştur
    const newReturn = await Return.create({
      reason: reason,
      order_id: orderId,
      return_date: new Date(),
      approval_status_id: 3, // Örneğin, 3 'Onay Bekleniyor' durumunu ifade edebilir
    });

    // Her bir `returnItem` için, ilgili `orderItem`'ı bul ve `ReturnItem` tablosunda kayıt oluştur.
    const returnItemPromises = returnItems.map(async (item) => {
      // İlgili `orderItem`'ı bul
      const orderItem = await OrderItem.findOne({
        where: {
          order_item_id: item.orderItemId
        }
      });

      // Eğer bulunan `orderItem` için iade miktarı, sipariş miktarını geçmiyorsa iade kaydını oluştur
      if (orderItem && item.quantity <= orderItem.quantity) {
        return ReturnItem.create({
          return_id: newReturn.return_id,
          quantity: item.quantity,
          condition: item.condition,
          seller_product_id: orderItem.seller_product_id
        });
      } else {
        // Hatalı iade miktarı veya bulunamayan orderItem durumları için hata yönetimi
        throw new Error(`Hatalı iade talebi: OrderItem ${item.orderItemId} için miktar aşımı veya bulunamadı.`);
      }
    });

    // Tüm `returnItem` kayıtlarını oluştur
    await Promise.all(returnItemPromises);

    res.status(201).json({ success: true, message: "İade talebi başarıyla oluşturuldu." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**   
  "orderId": 123,
  "reason": "Ürün bozuk çıktı",
  "returnItems": 
  [
      { "orderItemId": 1, "quantity": 2, "condition": "Bozuk" },
      { "orderItemId": 2, "quantity": 1, "condition": "Açılmış" }
  ] 
    
*/
const getUserReturnRequests = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    // Kullanıcının siparişlerini bul
    const userOrders = await Order.findAll({
      where: { user_id: user.user_id },
    });

    const orderIds = userOrders.map(order => order.order_id);

    // Bu siparişlere ait iade taleplerini bul
    const returnRequests = await Return.findAll({
      where: { order_id: orderIds }, // Varsayım: Return modelinde order_id alanı var
      include: [{
        model: ReturnItem,
        include: [{
          model: sellerProduct, // SellerProduct modeli ReturnItem ile ilişkilendirilmeli
          // SellerProduct modelinizde ekstra ilişkilendirilmiş modeller varsa buraya dahil edilebilir.
        }]
      }]
    });

    res.status(200).json(returnRequests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
const cancelReturnRequest = async (req, res) => {
  const { returnId } = req.body; // İptal edilecek iade talebinin ID'si

  try {
    // İade talebini ve ilişkili `ReturnItem` kayıtlarını bul
    const returnRequest = await Return.findByPk(returnId);
    if (!returnRequest) {
      return res.status(404).json({ success: false, message: "İade talebi bulunamadı." });
    }

    // İlişkili `ReturnItem` kayıtlarını sil
    await ReturnItem.destroy({
      where: {
        return_id: returnId
      }
    });

    // İade talebini sil
    await returnRequest.destroy();

    res.status(200).json({ success: true, message: "İade talebi başarıyla iptal edildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ÜRÜN SORU İŞLEMLERİ

const askQuestion = async (req, res) => {
  try {
    const newQuestion = await productQuestion.create({
      ...req.body,
      date_asked: new Date(),
      approval_status_id: 3
      // Diğer gerekli alanları da burada ekleyebilirsiniz
    });

    res.status(201).json({ message: 'Soru başarıyla eklendi.', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Soru eklenirken bir hata oluştu.', error: error.message });
  }
}
const listMyQuestions = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    const questions = await productQuestion.findAll({
      where: { user_id: user.user_id },
      include: [
        {
          model: Product
        }
      ],
      order: [['date_asked', 'DESC']],
    });

    if (questions.length > 0) {
      res.status(200).json(questions);
    } else {
      res.status(404).json({ message: 'Soru bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Soruları yüklerken bir hata oluştu.', error: error.message });
  }
}
const getAnsweredQuestionsForProduct = async (req, res) => {
  const { productId } = req.params; // Ürün ID'si URL parametresinden alınır

  try {
    const questions = await productQuestion.findAll({
      where: {
        product_id: productId,
        answer: {
          [Op.not]: null, // answer alanı null olmayan kayıtları getir
          [Op.not]: '' // ve answer alanı boş string olmayan kayıtları getir
        }
      },
      include: [
        {
          model: Seller,
        },
        {
          model: User
        }
      ],
      order: [['date_asked', 'DESC']] // En son sorulan soruları ilk sırada getir
    });

    if (questions.length > 0) {
      res.status(200).json(questions);
    } else {
      res.status(404).json({ message: 'Cevaplanmış soru bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Soruları yüklerken bir hata oluştu.', error: error.message });
  }
}

//KATEGORİ ÇEKME

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { approval_status_id: 1, category_id: null }, //SADECE ANA KATEGORİLER GELECEK
      include: [
        {
          model: Category,
        }
      ]
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const getSubCategoriesById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const categories = await Category.findAll({
      where: { approval_status_id: 1, category_id: categoryId }, //SADECE ANA KATEGORİLER GELECEK
      include: [
        {
          model: Category,
        }
      ]
    });

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// SLUG İLE VERİ ÇEKME İŞLEMLERİ

//TÜm ürünleri çekme
const getProducts = async (req, res) => {
  try {
    let favoriteProductsIds = [];
    if (req.user && req.user.email) {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    let products = await sellerProduct.findAll({
      where: { is_active: 1, approval_status_id: 1 },
      include: [{
        model: Seller
      },
      {
        model: Product,
        include: [{
          model: Brand
        },
        {
          model: Category
        },
        {
          model: productImage
        }]
      }],
      order: [['price', 'ASC']], // Fiyata göre sırala
    });

    // Ürünleri benzersiz hale getir, en düşük fiyatlı ve stokta olanı seç
    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product_id // `sellerProduct` üzerinden `product_id` ile filtreleme
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: [] // `Product`'a ait özellikler bu seviyede istenmiyor
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'], // Ürün ID'sine göre gruplama yaparak doğru sonuçlar elde et
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }


    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = favoriteProductsIds.includes(product.product.product_id);
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite: req.user && req.user.email ? isFavorite : undefined, // Giriş yapılmışsa favori durumunu, yapmamışsa undefined döndür
        stockStatus: stockStatus, // STOK DURUMU
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
//Ürün bilgilerini çekme slug a göre
const getProductsBySlug = async (req, res) => {
  const { productSlug } = req.params; // Ürün slug'ı URL parametresinden alınır
  try {
    let user = null;
    let favoriteProductsIds = [];
    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const product = await Product.findOne({ where: { slug: productSlug } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    const sellerProductData = await sellerProduct.findOne({
      where: { product_id: product.product_id, is_active: 1, stock: { [Op.gt]: 0 } },
      include: [{
        model: Seller
      }, {
        model: Product,
        include: [{
          model: Brand
        }, {
          model: Category
        }, { model: productImage }]
      }],
      order: [['price', 'ASC']], // Fiyata göre sırala
    });

    if (!sellerProductData) {
      return res.status(404).json({ success: false, message: 'Satıcı ürünü bulunamadı' });
    }

    // Ürün yorumları ve puanlarının hesaplanması
    const ratingsData = await ProductComment.findAll({
      where: {
        '$sellerProduct.product_id$': product.product_id // `sellerProduct` üzerinden `product_id` ile filtreleme
      },
      include: [{
        model: sellerProduct,
        attributes: [],
        include: [{
          model: Product,
          attributes: [] // `Product`'a ait özellikler bu seviyede istenmiyor
        }]
      }],
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
      ],
      group: ['sellerProduct.product_id'], // Ürün ID'sine göre gruplama yaparak doğru sonuçlar elde et
      raw: true
    });

    const commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
    const commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";

    const isFavorite = user ? favoriteProductsIds.includes(sellerProductData.product.product_id) : false;
    const stockStatus = sellerProductData.stock === 0 ? 'Stokta yok' : 'Stokta var';

    const productWithFavoritesAndPrice = {
      ...sellerProductData.toJSON(),
      isFavorite: req.user && req.user.email ? isFavorite : undefined,
      stockStatus: stockStatus,
      commentAvg: commentAvg,
      commentCount: commentCount
    };

    return res.status(200).json(productWithFavoritesAndPrice);

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//Eğer satıcı girilmemişse sistemdeki en ucuz ürünü getirir.
const getProductsBySellerSlug = async (req, res) => {
  const { productSlug } = req.params; // Ürün slug'ı URL parametresinden alınır
  const { mg } = req.query; // Mağaza slug'ı query parametresinden alınır
  try {
    let user = null;
    let favoriteProductsIds = [];
    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const product = await Product.findOne({ where: { slug: productSlug } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    let seller = await Seller.findOne({ where: { slug: mg } });
    let productsQuery = { product_id: product.product_id, is_active: 1 };

    if (!seller) {
      productsQuery = { ...productsQuery }; // Satıcı sınırlamasını kaldır
    } else {
      productsQuery = { ...productsQuery, seller_id: seller.seller_id }; // Belirli bir satıcı için sınırla
    }

    let products = await sellerProduct.findAll({
      where: productsQuery,
      include: [{
        model: Seller
      }, {
        model: Product,
        include: [
          {
            model: Brand
          },
          {
            model: Category
          },
          {
            model: productImage
          }
        ]
      }],
      order: [['price', 'ASC']], // Fiyata göre sırala
    });

    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product.product_id // `sellerProduct` üzerinden `product_id` ile filtreleme
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: [] // `Product`'a ait özellikler bu seviyede istenmiyor
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'], // Ürün ID'sine göre gruplama yaparak doğru sonuçlar elde et
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = user ? favoriteProductsIds.includes(product.product.product_id) : false;
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite: isFavorite, // FAVORİ DURUMU
        stockStatus: stockStatus, //STOK DURUMU
        commentAvg: product.dataValues.commentAvg, // Ortalama Yorum Puanı
        commentCount: product.dataValues.commentCount // Yorum Sayısı
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Kategoriye göre ürün çekme
const getProductsByCategorySlug = async (req, res) => {
  const { categorySlug } = req.params;

  try {
    let user = null;
    let favoriteProductsIds = [];

    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const category = await Category.findOne({ where: { slug: categorySlug } });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    }

    let products = await sellerProduct.findAll({
      where: { is_active: 1 },
      include: [{
        model: Product,
        required: true,
        where: { category_id: category.id },
        include: [{
          model: Brand
        },
        {
          model: Category
        },
        {
          model: productImage
        }
        ]
      }],
      order: [['price', 'ASC']]
    });

    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product.product_id // `sellerProduct` üzerinden `product_id` ile filtreleme
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: [] // `Product`'a ait özellikler bu seviyede istenmiyor
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'], // Ürün ID'sine göre gruplama yaparak doğru sonuçlar elde et
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = user ? favoriteProductsIds.includes(product.product.product_id) : false;
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite,
        stockStatus,
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//Satıcıya göre ürünleri çekme
const getProductsBySeller = async (req, res) => {
  const { sellerSlug } = req.params;

  try {
    let user = null;
    let favoriteProductsIds = [];

    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const seller = await Seller.findOne({ where: { slug: sellerSlug } });
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Satıcı bulunamadı' });
    }

    let products = await sellerProduct.findAll({
      where: { seller_id: seller.seller_id, is_active: 1 },
      include: [{
        model: Product,
        include: [{ model: Brand }, { model: Category }, { model: productImage }]
      }],
      order: [['price', 'ASC']]
    });

    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product.product_id
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: []
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'],
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = user ? favoriteProductsIds.includes(product.product.product_id) : false;
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite,
        stockStatus,
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//Ürüne göre diğer satıcılara ait ürünleri çekme
const getSellerProductByProductId = async (req, res) => {
  const { productId, sellerProductId } = req.params;

  try {
    let user = null;
    let favoriteProductsIds = [];

    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const products = await sellerProduct.findAll({
      where: {
        is_active: 1,
        approval_status_id: 1,
        product_id: productId,
        ...(sellerProductId && { seller_product_id: { [Op.ne]: sellerProductId } })
      },
      include: [
        {
          model: Product,
          include: [{ model: Brand }, { model: Category }]
        },
        {
          model: Seller,
          attributes: ['seller_id', 'username', 'slug']
        }
      ],
      order: [['price', 'ASC']]
    });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


//Satıcı bilgileri
const getSellerInfo = async (req, res) => {

  try {
    const { sellerSlug } = req.params;

    const seller = await Seller.findOne({ where: { slug: sellerSlug } });

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Satıcı bulunamadı.' });
    }

    return res.status(200).json(seller);
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }



}


// Markaya göre ürün çekme
const getProductsByBrandSlug = async (req, res) => {
  const { brandSlug } = req.params;

  try {
    let user = null;
    let favoriteProductsIds = [];

    if (req.user) {
      user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const brand = await Brand.findOne({ where: { slug: brandSlug } });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Marka bulunamadı' });
    }

    let products = await sellerProduct.findAll({
      include: [{
        model: Product,
        where: { brand_id: brand.brand_id },
        include: [{ model: Brand }, { model: Category }, { model: productImage }]
      }],
      where: { is_active: 1 },
      order: [['price', 'ASC']]
    });

    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product.product_id
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: []
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'],
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = user ? favoriteProductsIds.includes(product.product.product_id) : false;
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite,
        stockStatus,
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}



// ARAMA İŞLEMLERİ

const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let favoriteProductsIds = [];
    if (req.user && req.user.email) {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    let products = await sellerProduct.findAll({
      where: {
        is_active: 1,
        [Op.or]: [
          { '$Product.name$': { [Op.like]: `%${search}%` } },
          { '$Product.Brand.brand_name$': { [Op.like]: `%${search}%` } },
          { '$Product.Category.category_name$': { [Op.like]: `%${search}%` } }
        ]
      },
      include: [{
        model: Seller
      },
      {
        model: Product,
        include: [{
          model: Brand
        },
        {
          model: Category
        },
        {
          model: productImage
        }]
      }],
      order: [['price', 'ASC']], // Fiyata göre sırala
    });

    // Ürünleri benzersiz hale getir, en düşük fiyatlı ve stokta olanı seç
    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: {
          '$sellerProduct.product_id$': product.product_id // `sellerProduct` üzerinden `product_id` ile filtreleme
        },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{
            model: Product,
            attributes: [] // `Product`'a ait özellikler bu seviyede istenmiyor
          }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'], // Ürün ID'sine göre gruplama yaparak doğru sonuçlar elde et
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = favoriteProductsIds.includes(product.product.product_id);
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite: req.user && req.user.email ? isFavorite : undefined, // Giriş yapılmışsa favori durumunu, yapmamışsa undefined döndür
        stockStatus: stockStatus, // STOK DURUMU
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


const getPhotos = async (req, res) => {
  const { productId } = req.params;
  try {
    const images = await productImage.findOne({ where: { product_id: productId } });
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error });
  }
}

const commentControl = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(406).json({ success: false, message: "User not found" });
    }

    const product = await Product.findOne({ where: { product_id: productId } });

    if (!product) {
      return res.status(409).json({ success: false, message: 'Ürün bulunamadı' });
    }

    const existingComment = await ProductComment.findOne({
      where: { user_id: user.user_id },
      include: [
        {
          model: sellerProduct,
          required: true, // sellerProduct modelinin dahil edilmesini zorunlu kılar
          include: [
            {
              model: Product,
              required: true, // Product modelinin dahil edilmesini zorunlu kılar
              where: { product_id: productId } // product_id'nin eşleştiği ürünleri getirir
            }
          ]
        }
      ]
    });


    if (existingComment) {
      return res.status(200).json({ success: false, message: "Bu ürüne daha önce yorum yaptınız." });
    }

    const productQuery = await OrderItem.findOne({
      include: [
        {
          model: Order,
          required: true,
          include: [
            {
              model: User,
              required: true,
              where: { user_id: user.user_id }
            }
          ]
        },
        {
          model: sellerProduct,
          required: true,
          include: [
            {
              model: Product,
              required: true,
              where: { product_id: productId }
            }
          ]
        }
      ]
    });

    if (productQuery) {
      return res.status(200).json({ success: true, purchased: true });
    } else {
      return res.status(200).json({ success: true, purchased: false, message: 'Değerlendirme yapabilmek için önce ürünü satın almalısınız.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Kullanıcı adı ve soyadını formatlayan yardımcı fonksiyon
function formatUserName(name, isPublic) {
  if (isPublic === 1) {
    const formattedFirstName = name.charAt(0) + '*'.repeat(name.length - 1);
    return `${formattedFirstName}`;
  } else {
    return `${name}`;
  }
}

const getTopSellingProducts = async (req, res) => {
  try {
    let favoriteProductsIds = [];
    if (req.user && req.user.email) {
      const user = await User.findOne({ where: { email: req.user.email } });
      if (user) {
        favoriteProductsIds = await UserFavoriteProduct.findAll({
          where: { user_id: user.user_id },
          attributes: ['product_id']
        }).then(favs => favs.map(fav => fav.product_id));
      }
    }

    const products = await sellerProduct.findAll({
      where: { is_active: 1 },
      include: [
        {
          model: Product,
          include: [
            { model: Brand },
            { model: Category },
            { model: productImage }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    const uniqueProductsMap = new Map();
    products.forEach(product => {
      const productId = product.product.product_id;
      if (product.stock > 0 && (!uniqueProductsMap.has(productId) || product.price < uniqueProductsMap.get(productId).price)) {
        uniqueProductsMap.set(productId, product);
      }
    });
    const uniqueLowestPriceProducts = Array.from(uniqueProductsMap.values());

    for (let product of uniqueLowestPriceProducts) {
      const ratingsData = await ProductComment.findAll({
        where: { '$sellerProduct.product_id$': product.product.product_id },
        include: [{
          model: sellerProduct,
          attributes: [],
          include: [{ model: Product, attributes: [] }]
        }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('rating')), 'RatingCount']
        ],
        group: ['sellerProduct.product_id'],
        raw: true
      });

      product.dataValues.commentAvg = ratingsData[0] && ratingsData[0].averageRating ? parseFloat(ratingsData[0].averageRating).toFixed(1) : "0";
      product.dataValues.commentCount = ratingsData[0] && ratingsData[0].RatingCount ? ratingsData[0].RatingCount : "0";
    }

    const productsWithFavoritesAndPrice = uniqueLowestPriceProducts.map(product => {
      const isFavorite = favoriteProductsIds.includes(product.product.product_id);
      const stockStatus = product.stock === 0 ? 'Stokta yok' : 'Stokta var';
      return {
        ...product.toJSON(),
        isFavorite,
        stockStatus,
        commentAvg: product.dataValues.commentAvg,
        commentCount: product.dataValues.commentCount
      };
    });

    return res.status(200).json(productsWithFavoritesAndPrice);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login, register, listUsers, getUserDetails, updateUserDetail,
  addItem, updateItem, deleteItem, getCartItems, getProducts,
  getLists, createList, deleteList, updateList,
  addItemToList, getItemsByListId, removeItemFromList, getPublicListItemsBySlug,
  getAddresses, createAddress, updateAddress, deleteAddress,
  getorders, getOrderItems, createOrder, cancelOrderItem, cancelOrder,
  getFavorites, addFavoriteItem, deleteFavoriteItem,
  getProductCommentsByUser, getProductComments, createProductComments,
  updateProductComments, deleteProductComments,
  getSellerCommentsByUser, getSellerComments, createSellerComment,
  updateSellerComments, deleteSellerComments,
  toggleFollowSeller, checkFollowStatus, getFollowedSellers,
  createReturnRequest, getUserReturnRequests, cancelReturnRequest,
  askQuestion, listMyQuestions, getAnsweredQuestionsForProduct,
  getProductsBySellerSlug, getProductsBySlug, getProductsByCategorySlug, getProductsByBrandSlug, getProductsBySeller,
  getCategories, getSubCategoriesById, searchProducts, getPhotos, clearCart, getSellerProductByProductId,
  getSellerInfo, commentControl, getorder, getTopSellingProducts
}
