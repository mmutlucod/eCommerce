const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const Campaign = sequelize.define('Campaign', {
    campaign_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.TEXT,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE,
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Campaign;
