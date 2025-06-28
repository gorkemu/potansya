const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Her e-posta adresi benzersiz olmalı
    },
    password: {
      type: String,
      required: true,
    },
    // Gelecekte eklenecek diğer alanlar
    // skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
  }
);

// Kullanıcı kaydedilmeden HEMEN ÖNCE çalışacak bir middleware
// Şifreyi hash'lemek için kullanacağız
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // Eğer şifre değiştirilmediyse bir şey yapma
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;