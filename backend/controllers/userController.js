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


// @desc    Kullanıcı profilini günceller
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user, protect middleware'inden geliyor
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.headline = req.body.headline || user.headline;
    
    // Eğer istekte bu alanlar varsa, onları güncelle.
    // Bu, kullanıcının sadece tek bir alanı (örn: sadece skilleri) göndermesine izin verir.
    if (req.body.skills) {
        user.skills = req.body.skills;
    }
    if (req.body.experiences) {
        user.experiences = req.body.experiences;
    }
    if (req.body.interests) {
        user.interests = req.body.interests;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      headline: updatedUser.headline,
      skills: updatedUser.skills,
      experiences: updatedUser.experiences,
      interests: updatedUser.interests,
      token: generateToken(updatedUser._id), // İsteğe bağlı, token'ı tazelemek için
    });
  } else {
    res.status(404);
    throw new Error('Kullanıcı bulunamadı');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile, 
};