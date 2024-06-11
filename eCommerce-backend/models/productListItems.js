const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const ProductListItems = sequelize.define('ProductListItems', {
    item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    list_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER
})

module.exports = ProductListItems;