const Address = require('./address.js');
const Admin = require('./admin');
const ApprovalStatus = require('./approval_status.js');
const Brand = require('./Brand.js');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Category = require('./category');
const CorporateTypes = require('./corporateTypes');
const Discount = require('./discount');
const Follow = require('./follow');
const FollowReward = require('./followReward');
const Order = require('./order');
const OrderItem = require('./orderItem');
const OrderStatus = require('./orderStatus');
const Product = require('./product');
const ProductComment = require('./productComment');
const ProductImage = require('./productImage');
const ProductList = require('./productList');
const ProductListItems = require('./productListItems');
const ProductQuestion = require('./productQuestion');
const Property = require('./property');
const Seller = require('./seller');
const SellerProduct = require('./sellerProduct');
const SellerShippingAgreements = require('./sellerShippingAgreements');
const ShippingCompany = require('./shippingCompany');
const User = require('./user');
const UserFavoriteProduct = require('./userFavoriteProduct');
const Campaign = require('./campaign');
const CampaignConditions = require('./campaignConditions');
const CampaignProducts = require('./campaignProducts');
const ReturnItem = require('./returnItem.js');
const Return = require('./return.js');

Address.belongsTo(User, { foreignKey: 'user_id' }); // Bir adres bir kullanıcıya ait olur
User.hasMany(Address, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla adresi olabilir

Order.belongsTo(Address, { foreignKey: 'address_id' }); // Bir adres bir kullanıcıya ait olur
Address.hasMany(Order, { foreignKey: 'address_id' }); // Bir kullanıcının birden fazla adresi olabilir

Brand.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir marka onay durumuna ait olur
ApprovalStatus.hasMany(Brand, { foreignKey: 'approval_status_id' }); // Bir onay durumu birden fazla markaya sahip olabilir

Brand.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir marka bir moderatöre ait olur
Admin.hasMany(Brand, { foreignKey: 'admin_id' }); // Bir moderatör birden fazla markaya sahip olabilir

Brand.belongsTo(Seller, { foreignKey: 'seller_id' });
Seller.hasMany(Brand, { foreignKey: 'seller_id' });

Cart.belongsTo(User, { foreignKey: 'user_id' }); // Bir sepet bir kullanıcıya ait olur
User.hasMany(Cart, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla sepeti olabilir

CartItem.belongsTo(SellerProduct, { foreignKey: 'seller_product_id' }); // Bir cart item bir ürüne ait olur
SellerProduct.hasMany(CartItem, { foreignKey: 'seller_product_id' }); // Bir ürün birden fazla cart item'a sahip olabilir

CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id' });

Category.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir kategori onay durumuna ait olur
ApprovalStatus.hasMany(Category, { foreignKey: 'approval_status_id' }); // Bir onay durumu birden fazla kategoriye sahip olabilir

Category.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir kategori bir moderatöre ait olur
Admin.hasMany(Category, { foreignKey: 'admin_id' }); // Bir moderatör birden fazla kategoriye sahip olabilir

// Category modeli için self-referencing ilişki kurulumu ve cascade kurallarının eklenmesi
Category.belongsTo(Category, { as: 'SubCategories', foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Category.hasMany(Category, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Discount.belongsTo(Product, { foreignKey: 'product_id' }); // Bir indirim bir ürüne ait olur
Product.hasMany(Discount, { foreignKey: 'product_id' }); // Bir ürün birden fazla indirime sahip olabilir

Discount.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir indirim bir satıcıya ait olur
Seller.hasMany(Discount, { foreignKey: 'seller_id' }); // Bir satıcı birden fazla indirime sahip olabilir

Follow.belongsTo(User, { foreignKey: 'user_id' }); // Bir takip bir kullanıcıya ait olur
User.hasMany(Follow, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla takibi olabilir

Follow.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir takip bir satıcıya ait olur
Seller.hasMany(Follow, { foreignKey: 'seller_id' }); // Bir satıcının birden fazla takipçisi olabilir

FollowReward.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir takip ödülü bir satıcıya ait olur

Order.belongsTo(User, { foreignKey: 'user_id' }); // Bir sipariş bir kullanıcıya ait olur
User.hasMany(Order, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla siparişi olabilir

Order.belongsTo(OrderStatus, { foreignKey: 'order_status_id' }); // Bir sipariş bir sipariş durumuna ait olur
OrderStatus.hasMany(Order, { foreignKey: 'order_status_id' }); // Bir sipariş durumuna birden fazla sipariş bağlı olabilir

OrderItem.belongsTo(Order, { foreignKey: 'order_id' }); // Bir sipariş kalemi bir siparişe ait olur
Order.hasMany(OrderItem, { foreignKey: 'order_id' }); // Bir siparişin birden fazla sipariş kalemi olabilir

OrderItem.belongsTo(SellerProduct, { foreignKey: 'seller_product_id' }); // Bir sipariş kalemi bir satıcı ürününe ait olur
SellerProduct.hasMany(OrderItem, { foreignKey: 'seller_product_id' }); // Bir satıcı ürününe birden fazla sipariş kalemi olabilir

OrderItem.belongsTo(OrderStatus, { foreignKey: 'order_status_id' });
OrderStatus.hasMany(OrderItem, { foreignKey: 'order_status_id' });

Product.belongsTo(Brand, { foreignKey: 'brand_id' }); // Bir ürün bir markaya ait olur
Brand.hasMany(Product, { foreignKey: 'brand_id' }); // Bir markaya birden fazla ürün bağlı olabilir

Product.belongsTo(Category, { foreignKey: 'category_id' }); // Bir ürün bir kategoriye ait olur
Category.hasMany(Product, { foreignKey: 'category_id' }); // Bir kategoriye birden fazla ürün bağlı olabilir

Product.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir ürün bir onay durumuna ait olur
ApprovalStatus.hasMany(Product, { foreignKey: 'approval_status_id' }); // Bir onay durumuna birden fazla ürün bağlı olabilir

Product.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir ürün bir moderatöre ait olur
Admin.hasMany(Product, { foreignKey: 'admin_id' }); // Bir moderatöre birden fazla ürün bağlı olabilir

ProductComment.belongsTo(SellerProduct, { foreignKey: 'seller_product_id' }); // Bir yorum bir ürüne ait olur
SellerProduct.hasMany(ProductComment, { foreignKey: 'seller_product_id' }); // Bir ürüne birden fazla yorum yapılabilir

ProductComment.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir kategori onay durumuna ait olur
ApprovalStatus.hasMany(ProductComment, { foreignKey: 'approval_status_id' }); // Bir onay durumu birden fazla kategoriye sahip olabilir

ProductComment.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir kategori bir moderatöre ait olur
Admin.hasMany(ProductComment, { foreignKey: 'admin_id' }); // Bir moderatör birden fazla kategoriye sahip olabilir

ProductComment.belongsTo(User, { foreignKey: 'user_id' }); // Bir yorum bir ürüne ait olur
User.hasMany(ProductComment, { foreignKey: 'user_id' }); // Bir ürüne birden fazla yorum yapılabilir




ProductImage.belongsTo(Product, { foreignKey: 'product_id' }); // Bir ürün resmi bir ürüne ait olur
Product.hasMany(ProductImage, { foreignKey: 'product_id' }); // Bir ürüne birden fazla ürün resmi olabilir

ProductList.belongsTo(User, { foreignKey: 'user_id' }); // Bir ürün listesi bir kullanıcıya ait olur
User.hasMany(ProductList, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla ürün listesi olabilir

ProductListItems.belongsTo(ProductList, { foreignKey: 'list_id' }); // Bir liste öğesi bir ürün listesine ait olur
ProductList.hasMany(ProductListItems, { foreignKey: 'list_id' }); // Bir ürün listesine birden fazla liste öğesi bağlı olabilir

ProductListItems.belongsTo(Product, { foreignKey: 'product_id' }); // Bir liste öğesi bir ürüne ait olur
Product.hasMany(ProductListItems, { foreignKey: 'product_id' }); // Bir ürüne birden fazla liste öğesi bağlı olabilir

ProductQuestion.belongsTo(Product, { foreignKey: 'product_id' }); // Bir ürün sorusu bir ürüne ait olur
Product.hasMany(ProductQuestion, { foreignKey: 'product_id' }); // Bir ürüne birden fazla ürün sorusu olabilir

ProductQuestion.belongsTo(User, { foreignKey: 'user_id' }); // Bir ürün sorusu bir kullanıcıya ait olur
User.hasMany(ProductQuestion, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla ürün sorusu olabilir

ProductQuestion.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir ürün sorusu bir satıcıya ait olur
Seller.hasMany(ProductQuestion, { foreignKey: 'seller_id' }); // Bir satıcının birden fazla ürün sorusu olabilir

ProductQuestion.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir ürün sorusu bir onay durumuna ait olur
ApprovalStatus.hasMany(ProductQuestion, { foreignKey: 'approval_status_id' }); // Bir onay durumuna birden fazla ürün sorusu olabilir

ProductQuestion.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir ürün sorusu bir moderatöre ait olur
Admin.hasMany(ProductQuestion, { foreignKey: 'admin_id' }); // Bir moderatörün birden fazla ürün sorusu olabilir

Property.belongsTo(Category, { foreignKey: 'category_id' }); // Bir özellik bir kategoriye ait olur
Category.hasMany(Property, { foreignKey: 'category_id' }); // Bir kategorinin birden fazla özelliği olabilir

Property.belongsTo(Product, { foreignKey: 'product_id' }); // Bir özellik bir ürüne ait olur
Product.hasMany(Property, { foreignKey: 'product_id' }); // Bir ürünün birden fazla özelliği olabilir

Seller.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir satıcı bir moderatöre ait olur
Admin.hasMany(Seller, { foreignKey: 'admin_id' }); // Bir moderatör birden fazla satıcıya sahip olabilir

Seller.belongsTo(Category, { foreignKey: 'category_id' }); // Bir satıcı bir ürün kategorisine ait olur
Category.hasMany(Seller, { foreignKey: 'category_id' }); // Bir ürün kategorisine birden fazla satıcı bağlı olabilir

Seller.belongsTo(CorporateTypes, { foreignKey: 'corporate_type_id' });// Seller tablosu, CorporateTypes tablosuna corporate_type_id dış anahtarını kullanarak bağlıdır.
CorporateTypes.hasMany(Seller, { foreignKey: 'corporate_type_id' });// CorporateTypes tablosu, Seller tablosuna corporate_type_id dış anahtarını kullanarak birçok satıcıya sahiptir.

Seller.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' });
ApprovalStatus.hasMany(Seller, { foreignKey: 'approval_status_id' });

SellerProduct.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir satıcı ürünü bir satıcıya ait olur
Seller.hasMany(SellerProduct, { foreignKey: 'seller_id' }); // Bir satıcının birden fazla ürünü olabilir

SellerProduct.belongsTo(Product, { foreignKey: 'product_id' }); // Bir satıcı ürünü bir ürüne ait olur
Product.hasMany(SellerProduct, { foreignKey: 'product_id' }); // Bir ürüne birden fazla satıcı ürünü olabilir

SellerProduct.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' }); // Bir satıcı ürünü bir onay durumuna ait olur
ApprovalStatus.hasMany(SellerProduct, { foreignKey: 'approval_status_id' }); // Bir onay durumuna birden fazla satıcı ürünü olabilir

SellerProduct.belongsTo(Admin, { foreignKey: 'admin_id' }); // Bir satıcı ürünü bir moderatöre ait olur
Admin.hasMany(SellerProduct, { foreignKey: 'admin_id' }); // Bir moderatörün birden fazla satıcı ürünü olabilir

SellerShippingAgreements.belongsTo(Seller, { foreignKey: 'seller_id' }); // Bir satıcı nakliye anlaşması bir satıcıya ait olur
Seller.hasMany(SellerShippingAgreements, { foreignKey: 'seller_id' }); // Bir satıcının birden fazla nakliye anlaşması olabilir

SellerShippingAgreements.belongsTo(ShippingCompany, { foreignKey: 'company_id' }); // Bir satıcı nakliye anlaşması bir şirkete ait olur
ShippingCompany.hasMany(SellerShippingAgreements, { foreignKey: 'company_id' }); // Bir şirketin birden fazla nakliye anlaşması olabilir

UserFavoriteProduct.belongsTo(User, { foreignKey: 'user_id' }); // Bir kullanıcının favori ürünü bir kullanıcıya ait olur
User.hasMany(UserFavoriteProduct, { foreignKey: 'user_id' }); // Bir kullanıcının birden fazla favori ürünü olabilir

UserFavoriteProduct.belongsTo(Product, { foreignKey: 'product_id' }); // Bir kullanıcının favori ürünü bir ürüne ait olur
Product.hasMany(UserFavoriteProduct, { foreignKey: 'product_id' }); // Bir ürün birden fazla kullanıcının favorisi olabilir

CampaignConditions.belongsTo(Campaign, { foreignKey: 'campaign_id' }); // Kampanya koşulları, bir kampanyaya ait olur
Campaign.hasMany(CampaignConditions, { foreignKey: 'campaign_id' }); // Bir kampanya birden fazla koşula sahip olabilir

Product.hasMany(CampaignProducts, { foreignKey: 'product_id' }); // Her bir ürün birden fazla kampanya ürününe sahip olabilir.
CampaignProducts.belongsTo(Product, { foreignKey: 'product_id' }); // Her kampanya ürünü, belirli bir ürüne aittir.

Seller.hasMany(Campaign, { foreignKey: 'seller_id' }); // Her bir satıcı birden fazla kampanyaya sahip olabilir.
Campaign.belongsTo(Seller, { foreignKey: 'seller_id' }); // Her bir kampanya, belirli bir satıcıya aittir.

Return.belongsTo(Order, { foreignKey: 'order_id' });// Her iade belirli bir siparişe aittir
Order.hasMany(Return, { foreignKey: 'order_id' });// Bir sipariş birden fazla iade içerebilir

Return.belongsTo(ApprovalStatus, { foreignKey: 'approval_status_id' });
ApprovalStatus.hasMany(Return, { foreignKey: 'approval_status_id' });

ReturnItem.belongsTo(Return, { foreignKey: 'return_id' });// Her iade detayı belirli bir iadeye aittir
Return.hasMany(ReturnItem, { foreignKey: 'return_id' });// Bir iade birden fazla iade detayı içerebilir

ReturnItem.belongsTo(SellerProduct, { foreignKey: 'seller_product_id' });// Her iade detayı belirli bir ürüne aittir
SellerProduct.hasMany(ReturnItem, { foreignKey: 'seller_product_id' });// Bir ürün birden fazla iade detayı içerebilir (opsiyonel)
