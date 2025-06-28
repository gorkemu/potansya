const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// /api/users/ adresine gelen POST isteğini registerUser fonksiyonuna yönlendir
router.post('/', registerUser);

module.exports = router;