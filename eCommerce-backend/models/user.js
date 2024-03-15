const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const User = sequelize.define('user', {
    user_id: {
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
});

module.exports = User;