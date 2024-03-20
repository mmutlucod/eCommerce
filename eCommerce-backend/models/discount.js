const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Discount = sequelize.define('Discount', {
    discount_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    seller_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER,
    discount_type: Sequelize.INTEGER,
    discount_amount: Sequelize.DECIMAL,
    minimum_purchase_amount: Sequelize.DECIMAL,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
})

module.exports = Discount;