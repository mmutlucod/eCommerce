const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

// Auth Middleware
const authMiddleware = (req, res, next) => {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;

    // Token var mı ve "Bearer " ile başlıyor mu kontrol et
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token is required or format is wrong' });
    }

    // "Bearer " önekini kaldır ve token'ı al
    const token = authHeader.split(' ')[1];

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token doğrulandıktan sonra, decoded bilgisini request nesnesine ekle
        req.user = decoded;

        // Eğer kullanıcının rolü token içerisinde saklanıyorsa, bu bilgi artık req.user içerisinde mevcuttur
        // Örneğin: req.user.role

        // Sonraki middleware'e geç
        next();
    } catch (error) {
        // Token doğrulanamazsa hata dön
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
const roleCheckMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (req.user && allowedRoles.includes(req.user.role)) {
            next(); // Erişim izni ver
        } else {
            res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' }); // Erişim reddedildi
        }
    };
};
// authOptionalMiddleware.js
const authOptionalMiddleware = (req, res, next) => {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;

    // Token var mı ve "Bearer " ile başlıyor mu kontrol et
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Eğer token yoksa veya format yanlışsa, req.user'ı boş olarak ayarla ve sonraki middleware'e geç
        req.user = null;
        return next();
    }

    // "Bearer " önekini kaldır ve token'ı al
    const token = authHeader.split(' ')[1];

    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token doğrulandıktan sonra, decoded bilgisini request nesnesine ekle
        req.user = decoded;

        // Sonraki middleware'e geç
        next();
    } catch (error) {
        // Token doğrulanamazsa, req.user'ı boş olarak ayarla ve sonraki middleware'e geç
        req.user = null;
        next();
    }
};


module.exports = { authMiddleware, roleCheckMiddleware, authOptionalMiddleware };
