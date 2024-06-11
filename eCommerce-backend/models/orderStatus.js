const Sequelize = require('sequelize');

const sequelize = require('../utility/db');

const orderStatus = sequelize.define('orderStatus', {
    order_status_id: {
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
        { order_status_id: 1, status_name: 'Sipariş Alındı' },
        { order_status_id: 2, status_name: 'Sipariş Hazırlanıyor' },
        { order_status_id: 3, status_name: 'Sipariş Kargoya Verildi' },
        { order_status_id: 4, status_name: 'Sipariş Teslim Edildi' },
        { order_status_id: 5, status_name: 'Siparişiniz İptal Edildi' },
        { order_status_id: 6, status_name: 'Siparişiniz İade Edildi' }
    ];

    // Bulk create ile durumları veritabanına ekle
    // Bu işlem, aynı isme sahip durumlar zaten varsa bunları yeniden eklemeyecektir.
    await orderStatus.bulkCreate(statuses, {
        updateOnDuplicate: ['status_name'] // Zaten var olan kayıtları güncelleme
    });
});

module.exports = orderStatus;