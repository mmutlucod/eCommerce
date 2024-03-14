const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const shippingCompany = sequelize.define('shippingCompany', {
    company_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    company_name: Sequelize.STRING
})

module.exports = shippingCompany;