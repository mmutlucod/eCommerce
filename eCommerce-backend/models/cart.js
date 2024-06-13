const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Cart = sequelize.define('Cart', {
    cart_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER
})

module.exports = Cart;

