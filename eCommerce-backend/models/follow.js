const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Follow = sequelize.define('Follow', {
    follow_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    seller_id: Sequelize.INTEGER
})

module.exports = Follow;