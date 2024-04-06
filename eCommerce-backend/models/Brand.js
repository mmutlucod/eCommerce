const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Brand = sequelize.define('Brand', {
    brand_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    brand_name: Sequelize.STRING,
    description: Sequelize.TEXT,
    seller_id: Sequelize.INTEGER,
    slug: {
        type: Sequelize.STRING,
        unique: true // Slug'ın benzersiz olduğundan emin olun.
    },
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
})

module.exports = Brand;