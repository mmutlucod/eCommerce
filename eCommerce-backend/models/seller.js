const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const Seller = sequelize.define('seller', {
    seller_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: Sequelize.STRING,
    name: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    corporate_type_id: Sequelize.INTEGER,
    tax_identity_number: Sequelize.INTEGER,
    city: Sequelize.STRING,
    district: Sequelize.STRING,
    slug: {
        type: Sequelize.STRING,
        unique: true // Slug'ın benzersiz olduğundan emin olun.
    },
    reference_code: Sequelize.STRING,
    password: Sequelize.STRING,
    approval_status_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    admin_id: Sequelize.INTEGER
})

Seller.afterSync(async () => {
    // İstenen başlangıç durumlarını tanımla
    const statuses = [
        {
            username: 'umutkarakas',
            password: '$2b$10$NHlsLPkdBkp/V/gZGt3WKuVIBO4NBdLdZXbfj7x9RD.uob9chwCBC',
            approval_status_id: 1,
            slug: 'umutkarakas'
        },
        {
            username: 'mustafamutlu',
            password: '$2b$10$izywZ7O/s/9A7ObokD1pfOqqqaXYcPMuxUnOM/MDV.a0Joj1ZJGae',
            approval_status_id: 1,
            slug: 'mustafamutlu'
        }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await Seller.bulkCreate(statuses, {
        updateOnDuplicate: ['username'] // Zaten var olan kayıtları güncelleme
    });
});

module.exports = Seller;