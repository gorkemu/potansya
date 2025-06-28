require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Express uygulamasını oluştur
const app = express();
// Middleware'ler
app.use(cors()); // CORS'u etkinleştir
app.use(express.json()); // Gelen JSON isteklerini parse et
// Basit bir test route'u
app.get('/', (req, res) => {
res.send('Potansya API Sunucusu Çalışıyor! 🚀');
});
// Sunucuyu dinleyeceğimiz port'u belirle
const PORT = process.env.PORT || 5001; // .env'de PORT varsa onu, yoksa 5001'i kullan
// Sunucuyu başlat
app.listen(PORT, () => {
console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});