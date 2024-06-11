const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const sellerShippingAgreements = sequelize.define('sellerShippingAgreements', {
    agreement_id: Sequelize.INTEGER,
    seller_id: Sequelize.INTEGER,
    company_id: Sequelize.INTEGER,
    agreement_code: Sequelize.INTEGER,
    agreement_details: Sequelize.TEXT
})

module.exports = sellerShippingAgreements;