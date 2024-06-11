const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Order = sequelize.define('order', {
    order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    address_id: Sequelize.INTEGER,
    order_date: Sequelize.DATE,
    total_price: Sequelize.DOUBLE,
    shipping_code: Sequelize.STRING,
    order_status_id: Sequelize.INTEGER
});

module.exports = Order;