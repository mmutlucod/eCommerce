const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const ReturnItem = sequelize.define('returnItem', {
    return_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    return_id: Sequelize.INTEGER,
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    condition: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    seller_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = ReturnItem;