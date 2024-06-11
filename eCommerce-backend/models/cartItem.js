const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seller_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cart_id: Sequelize.INTEGER
});

module.exports = CartItem;
