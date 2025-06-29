const express = require('express');
const router = express.Router();
const { generatePotentialRoles } = require('../controllers/nexusController');
const { protect } = require('../middleware/authMiddleware');

// Bu rota, sadece giriş yapmış kullanıcılar tarafından erişilebilir olmalı
router.get('/generate', protect, generatePotentialRoles);

module.exports = router;