const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const orderStatus = sequelize.define('orderStatus', {
    status_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status_name: Sequelize.STRING
})

orderStatus.afterSync(async () => {
    // İstenen başlangıç durumlarını tanımla
    const statuses = [
        { status_id: 1, status_name: 'Sipariş Alındı' },
        { status_id: 2, status_name: 'Sipariş Hazırlanıyor' },
        { status_id: 3, status_name: 'Sipariş Kargoya Verildi' },
        { status_id: 4, status_name: 'Sipariş Teslim Edildi' },
        { status_id: 5, status_name: 'Siparişiniz İptal Edildi' },
        { status_id: 6, status_name: 'Siparişiniz İade Edildi' }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await orderStatus.bulkCreate(statuses, {
        updateOnDuplicate: ['status_name'] // Zaten var olan kayıtları güncelleme
    });
});

module.exports = orderStatus;