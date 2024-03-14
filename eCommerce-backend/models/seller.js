const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Seller = sequelize.define('seller', {
    seller_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: Sequelize.STRING,
    name: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    corporate_type_id: Sequelize.INTEGER,
    tax_identity_number: Sequelize.INTEGER,
    city: Sequelize.STRING,
    district: Sequelize.STRING,
    reference_code: Sequelize.STRING,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    moderator_id: Sequelize.INTEGER
})

module.exports = Seller;