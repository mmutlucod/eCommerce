const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const productImage = sequelize.define('productImage', {
    image_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    product_id: Sequelize.INTEGER,
    image_path: Sequelize.STRING
})

module.exports = productImage;
