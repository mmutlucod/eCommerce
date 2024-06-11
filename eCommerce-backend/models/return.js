const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const Return = sequelize.define('return', {
    return_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reason: Sequelize.TEXT,
    return_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    approval_status_id: {
        type: Sequelize.INTEGER
    },
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Return;