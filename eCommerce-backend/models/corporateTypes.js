const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const corporateType = sequelize.define('corporateType', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
});

module.exports = corporateType;