const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const ProductComment = sequelize.define('ProductComment', {
    comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    comment: Sequelize.TEXT,
    seller_product_id: Sequelize.INTEGER,
    comment_date: new Date(),
    rating: Sequelize.INTEGER,
    is_public: Sequelize.INTEGER, //isim gizliliği
    is_deleted: Sequelize.INTEGER, //silinen yorum
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
})

module.exports = ProductComment;