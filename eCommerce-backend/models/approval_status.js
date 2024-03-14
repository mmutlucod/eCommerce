const Sequelize = require('sequelize');
const sequelize = require('../utility/db');

const ApprovalStatus = sequelize.define('ApprovalStatus', {
    approval_status_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status_name: Sequelize.TEXT
});

// Model senkronizasyonundan sonra çalışacak hook'u tanımla
ApprovalStatus.afterSync(async () => {
    // İstenen başlangıç durumlarını tanımla
    const statuses = [
        { status_name: 'Onaylandı' },
        { status_name: 'Reddedildi' },
        { status_name: 'Onay Bekleniyor' }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await ApprovalStatus.bulkCreate(statuses, {
        updateOnDuplicate: ['status_name'] // Zaten var olan kayıtları güncelleme
    });
});

module.exports = ApprovalStatus;
