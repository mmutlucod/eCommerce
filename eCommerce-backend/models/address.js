const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Address = sequelize.define('Address', {
    address_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    adres_line: Sequelize.TEXT,
    street: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    postal_code: Sequelize.STRING,
    user_id: Sequelize.INTEGER
})

module.exports = Address;