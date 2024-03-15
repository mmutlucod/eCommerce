const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Moderator = sequelize.define('moderator', {
    moderator_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    surname: Sequelize.STRING,
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    password: Sequelize.STRING
})
module.exports = Moderator;