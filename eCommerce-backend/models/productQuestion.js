const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const productQuestion = sequelize.define('productQuestion', {
    question_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    product_id: Sequelize.INTEGER,
    seller_id: Sequelize.INTEGER,
    user_id: Sequelize.INTEGER,
    question: Sequelize.TEXT,
    answer: Sequelize.TEXT,
    date_asked: Sequelize.DATE,
    date_answered: Sequelize.DATE,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    moderator_id: Sequelize.INTEGER
})

module.exports = productQuestion;