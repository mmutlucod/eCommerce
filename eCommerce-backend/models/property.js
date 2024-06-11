const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Property = sequelize.define('Property', {
    property_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    value: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER
})

module.exports = Property;