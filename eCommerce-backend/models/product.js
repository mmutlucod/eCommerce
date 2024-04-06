const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Product = sequelize.define('product', {
    product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    brand_id: Sequelize.INTEGER,
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    stock_code: Sequelize.STRING,
    max_buy: Sequelize.INTEGER,
    slug: {
        type: Sequelize.STRING,
        unique: true // Slug'ın benzersiz olduğundan emin olun.
    },
    category_id: Sequelize.INTEGER,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    price: Sequelize.INTEGER,
    admin_id: Sequelize.INTEGER
});

module.exports = Product;