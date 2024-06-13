const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const CampaignConditions = sequelize.define('CampaignConditions', {
    condition_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    product_id: Sequelize.INTEGER, // Opsiyonel: Belirli ürünleri hedefleyen koşullar için
    condition_type: Sequelize.STRING, // Örneğin, "BUY_X_GET_Y_FREE", "PERCENTAGE_OFF", vs.
    condition_value: Sequelize.STRING, // Koşul türüne bağlı olarak farklı değerler alabilir
    minimum_quantity: Sequelize.INTEGER, // Miktar bazlı indirimler için minimum ürün miktarı
    discount_percentage: Sequelize.DECIMAL, // Yüzde bazlı indirimler için
    discount_amount: Sequelize.DECIMAL // Sabit tutar indirimleri için
});

module.exports = CampaignConditions;
