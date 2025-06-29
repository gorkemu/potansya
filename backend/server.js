require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Veritabanına bağlan
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Ana Route
app.get('/', (req, res) => {
  res.send('Potansya API Sunucusu Çalışıyor! 🚀');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nexus', require('./routes/nexusRoutes'));


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde başlatıldı.`);
});