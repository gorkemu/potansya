const User = require('../models/userModel');
const asyncHandler = require('express-async-handler'); // Hata yakalamayı kolaylaştırır
const jwt = require('jsonwebtoken');

// JWT oluşturan yardımcı fonksiyon
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Yeni bir kullanıcı kaydeder
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Gerekli alanlar gönderilmiş mi diye kontrol et
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Lütfen tüm alanları doldurun');
  }

  // Kullanıcı zaten var mı diye kontrol et
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Bu e-posta adresi zaten kullanılıyor');
  }

  // Yeni kullanıcıyı oluştur
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Başarılı bir şekilde oluşturulduysa, kullanıcı bilgilerini ve bir token döndür
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Geçersiz kullanıcı verisi');
  }
});

module.exports = {
  registerUser,
};