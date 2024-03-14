const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const ProductComment = sequelize.define('ProductComment', {
    comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    seller_product_id: Sequelize.INTEGER,
    comment: Sequelize.TEXT,
    rating: Sequelize.INTEGER
})

module.exports = ProductComment;