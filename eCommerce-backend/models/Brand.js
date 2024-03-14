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
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    moderator_id: Sequelize.INTEGER
})

module.exports = Brand;