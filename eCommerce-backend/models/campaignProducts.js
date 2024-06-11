const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const CampaignProducts = sequelize.define('CampaignProducts', {
    campaign_product_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = CampaignProducts;
