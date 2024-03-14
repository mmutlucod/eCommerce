const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const orderStatus = sequelize.define('orderStatus', {
    status_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status_name: Sequelize.STRING
})

module.exports = orderStatus;