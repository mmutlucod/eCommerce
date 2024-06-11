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

User.afterSync(async () => {
    // İstenen başlangıç durumlarını tanımla
    const statuses = [
        {
            email: 'umutkarakas',
            password: '$2b$10$NHlsLPkdBkp/V/gZGt3WKuVIBO4NBdLdZXbfj7x9RD.uob9chwCBC'
        },
        {
            email: 'mustafamutlu',
            password: '$2b$10$izywZ7O/s/9A7ObokD1pfOqqqaXYcPMuxUnOM/MDV.a0Joj1ZJGae'
        }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await User.bulkCreate(statuses, {
        updateOnDuplicate: ['email'] // Zaten var olan kayıtları güncelleme
    });
});


module.exports = User;