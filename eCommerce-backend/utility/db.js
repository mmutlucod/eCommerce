const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopping', 'root', 'lPJYja3W1GiT2IPY', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;






