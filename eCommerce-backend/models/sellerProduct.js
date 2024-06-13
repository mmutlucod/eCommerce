const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const sellerProduct = sequelize.define('sellerProduct', {
    seller_product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    seller_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER,
    price: Sequelize.DOUBLE,
    stock: Sequelize.INTEGER,
    is_active: Sequelize.INTEGER,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
})

module.exports = sellerProduct;