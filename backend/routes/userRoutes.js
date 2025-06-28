const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); 

router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getMe) // GET isteği kullanıcı bilgilerini getirir
  .put(protect, updateUserProfile); // PUT isteği kullanıcı bilgilerini günceller

module.exports = router;