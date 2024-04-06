const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category_name: Sequelize.STRING,
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    category_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Bu, category_id'nin null olabileceği anlamına gelir
        references: {
            model: 'categories', // İlişkili modelin (tablonun) adı
            key: 'id' // İlişkili modelin hangi sütunuyla ilişkilendirildiği
        }
    },
    slug: {
        type: Sequelize.STRING,
        unique: true // Slug'ın benzersiz olduğundan emin olun.
    },
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
});

module.exports = Category;