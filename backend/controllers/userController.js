const User = require('../models/userModel');
const asyncHandler = require('express-async-handler'); // Hata yakalamayı kolaylaştırır
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// @desc    Kullanıcı girişi yapar ve token döndürür
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı e-postasına göre bul
  const user = await User.findOne({ email });

  // Kullanıcı var mı VE girdiği şifre doğru mu diye kontrol et
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error('Geçersiz e-posta veya şifre');
  }
});

// @desc    Kullanıcı profilini getirir
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user objesi, protect middleware'i tarafından eklendi
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};