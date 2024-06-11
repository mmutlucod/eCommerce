const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const UserFavoriteProduct = sequelize.define('UserFavoriteProduct', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER
})
module.exports = UserFavoriteProduct;