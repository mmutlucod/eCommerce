const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const ProductList = sequelize.define('ProductList', {
    list_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    list_name: Sequelize.INTEGER,
    is_public: Sequelize.INTEGER,
    created_at: Sequelize.DATE
})

module.exports = ProductList;
