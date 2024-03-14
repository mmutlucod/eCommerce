const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    order_id: Sequelize.INTEGER,
    seller_product_id: Sequelize.INTEGER,
    quantity: Sequelize.INTEGER,
    price: Sequelize.DOUBLE
})

module.exports = OrderItem;