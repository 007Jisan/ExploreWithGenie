const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// 🛠️ Middleware Setup
app.use(cors()); // Shobar upore thakbe
app.use(express.json());

// 🛣️ Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 🍃 MongoDB Connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('Database connection failed ❌:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));