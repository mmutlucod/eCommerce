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
    list_name: Sequelize.STRING,
    is_public: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    slug: {
        type: Sequelize.STRING,
        unique: true,
    }
})

module.exports = ProductList;
