const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı header'dan al ('Bearer TOKEN' formatından 'TOKEN' kısmını)
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı token'daki id ile bul ve şifresi hariç bilgilerini req objesine ekle
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Sonraki middleware'e veya controller'a geç
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Yetkisiz erişim, token başarısız');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Yetkisiz erişim, token bulunamadı');
  }
});

module.exports = { protect };