const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

const Spot = require('./models/Spot');
const seedSpots = require('./data/seedSpots');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

if (process.env.OPENAI_BASE_URL) {
  openaiConfig.baseURL = process.env.OPENAI_BASE_URL;
} else {
  openaiConfig.baseURL = 'https://openrouter.ai/api/v1';
}

const openai = new OpenAI(openaiConfig);

app.post('/api/chat', async (req, res) => {
  const { message, language = 'en' } = req.body;

  try {
    const targetLanguage = language === 'bn' ? 'Bengali' : 'English';
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful travel assistant named Genie for Explore with Genie. Reply only in ${targetLanguage}. Help with travel questions, itinerary planning, safety tips, route guidance, and budget advice focused on Bangladesh.`,
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.json({
      reply:
        language === 'bn'
          ? 'Genie is a little busy right now. Please try again later.'
          : "I'm a bit busy right now. Please try again later.",
    });
  }
});

app.get('/api/spots', async (req, res) => {
  try {
    const spots = await Spot.find().sort({ createdAt: -1 });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/spots/:id', async (req, res) => {
  try {
    const spot = await Spot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/seed-spots', async (req, res) => {
  try {
    await Spot.deleteMany({});
    await Spot.insertMany(seedSpots);
    res.send(`${seedSpots.length} tourist spots reseeded successfully with local original images.`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('Database connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
