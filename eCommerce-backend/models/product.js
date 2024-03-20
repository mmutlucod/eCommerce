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
    category_id: Sequelize.INTEGER,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
});

module.exports = Product;