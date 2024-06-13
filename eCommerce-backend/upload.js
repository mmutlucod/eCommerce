const multer = require('multer');
const path = require('path');

// Dosya depolama yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/img')); // Resimler public/img altına yüklenecek
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Dosya ismini benzersiz yapar
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Yükleme işlevi
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
