const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const SellerComment = sequelize.define('SellerComment', {
    comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    seller_id: Sequelize.INTEGER,
    comment: Sequelize.TEXT,
    comment_date: Sequelize.DATE,
    rating: Sequelize.INTEGER,
    is_public: Sequelize.INTEGER,
    is_deleted: Sequelize.INTEGER
})

module.exports = SellerComment;