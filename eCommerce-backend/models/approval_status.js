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

ApprovalStatus.afterSync(async () => {
    const statuses = [
        { status_name: 'Onaylandı' },
        { status_name: 'Reddedildi' },
        { status_name: 'Onay Bekleniyor' }
    ];

    for (const status of statuses) {
        // Öncelikle, status_name değerine göre mevcut kayıt olup olmadığını kontrol et
        const foundStatus = await ApprovalStatus.findOne({ where: { status_name: status.status_name } });

        // Eğer kayıt yoksa, yeni kaydı ekle
        if (!foundStatus) {
            await ApprovalStatus.create(status);
        }
    }
});

module.exports = ApprovalStatus;
