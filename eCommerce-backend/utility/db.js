const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopping', 'root', 'm22900534M', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;






