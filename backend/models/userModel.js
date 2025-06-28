const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Her bir deneyim objesinin şeması
const experienceSchema = mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // Bitiş tarihi olmayabilir (halen çalışıyor)
    description: { type: String },
});

// Her bir ilgi alanı objesinin şeması
const interestSchema = mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, enum: ['Hobi', 'Meraklı', 'Tutkulu'], default: 'Meraklı' }
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    headline: { // Kısa başlık, örn: "Yazılım Geliştirici | Müzisyen"
        type: String,
        default: '',
    },
    skills: [{ 
        type: String,
    }],
    experiences: [experienceSchema], 
    interests: [interestSchema],     
        
  },
  {
    timestamps: true,
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