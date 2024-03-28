const bcrypt = require('bcrypt'); // Şifreleri güvenli bir şekilde saklamak için bcrypt kütüphanesini kullanıyoruz
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // kullanıcı adı ile ara
        const user = await User.findOne({ where: { email } });

        // Kullanıcı bulunamazsa hata mesajı dön
        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Kullanıcının şifresini doğrula
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Şifre eşleşmiyorsa hata mesajı dön
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı veya şifre hatalı.' });
        }

        // Token oluştur (token içinde yalnızca gerekli ve güvenli bilgileri sakla)
        const tokenPayload = { id: user.id, username: user.username, role: 'user' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '100y', // Token süresi (örneğin 1 saat)
        });

        // Başarılı giriş yanıtı ve token dön
        return res.status(200).json({ message: 'Giriş başarılı.', token, role: 'user' });
    } catch (error) {
        // Hata yakalama ve loglama
        console.error('Giriş sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanılıyor.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email: email, password: hashedPassword });

        // Token oluştur
        const tokenPayload = { id: newUser.id, username: newUser.username, role: 'user' };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token süresi (örneğin 1 saat)
        });

        return res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser, token });
    } catch (error) {
        console.error('Kullanıcı kaydı sırasında bir hata oluştu:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};
const listUsers = async (req, res) => {
    try {
        // Tüm admin kullanıcılarını veritabanından çek
        const users = await User.findAll();

        // Başarılı yanıtı dön
        return res.status(200).json(users);
    } catch (error) {
        // Hata durumunda hata mesajını döndür
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getUserDetails = async (req, res) => {
    try {

    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const umut=3
module.exports = {
    login, register, listUsers,

}