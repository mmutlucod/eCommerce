const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Admin = sequelize.define('Admin', {
    admin_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    full_name: Sequelize.STRING,
    is_mod: Sequelize.BOOLEAN
});


// Model senkronizasyonundan sonra çalışacak hook'u tanımla
Admin.afterSync(async () => {
    // İstenen başlangıç durumlarını tanımla
    const statuses = [
        {
            username: 'umutkarakas',
            password: '$2b$10$NHlsLPkdBkp/V/gZGt3WKuVIBO4NBdLdZXbfj7x9RD.uob9chwCBC',
            is_mod: false
        },
        {
            username: 'mustafamutlu',
            password: '$2b$10$izywZ7O/s/9A7ObokD1pfOqqqaXYcPMuxUnOM/MDV.a0Joj1ZJGae',
            is_mod: false
        }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await Admin.bulkCreate(statuses, {
        updateOnDuplicate: ['username'] // Zaten var olan kayıtları güncelleme
    });
});

module.exports = Admin;