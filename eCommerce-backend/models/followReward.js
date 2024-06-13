const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const FollowReward = sequelize.define('FollowReward', {
    follow_reward_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    seller_id: Sequelize.INTEGER,
    minimum_purchase_amount: Sequelize.DECIMAL,
    reward_amount: Sequelize.DECIMAL,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE
})

module.exports = FollowReward;