const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

const Spot = require('./models/Spot'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ==========================================
// 🤖 Module 2: AI Travel Assistant (OpenRouter)
// ==========================================
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey: process.env.OPENAI_API_KEY, 
});

app.post('/api/chat', async (req, res) => {
  const { message, language = 'en' } = req.body;

  try {
    const targetLanguage = language === 'bn' ? 'Bengali' : 'English';

    const completion = await openai.chat.completions.create({
      // ✅ তোমার খুঁজে বের করা লেটেস্ট ফ্রি মডেল আইডি
      model: "nvidia/nemotron-3-super-120b-a12b:free", 
      messages: [
        { 
          role: "system", 
          content: `You are a helpful travel assistant named 'Genie' for 'Explore with Genie'. 
          Reply ONLY in ${targetLanguage}. Keep your answers very short, friendly, and helpful for tourists in Bangladesh.`
        },
        { role: "user", content: message }
      ],
    });

    if (completion.choices && completion.choices.length > 0) {
      res.json({ reply: completion.choices[0].message.content });
    } else {
      throw new Error("No response from AI model");
    }

  } catch (error) {
    console.error("❌ AI API Error Detail:", error.message);
    
    const fallbackMessage = language === 'bn' 
      ? "দুঃখিত ভাই, জিনি এখন একটু ব্যস্ত। দয়া করে আবার মেসেজ দিন!" 
      : "I'm sorry, I'm a bit busy right now. Please message me again!";
    
    res.json({ reply: fallbackMessage });
  }
});

// ==========================================
// 🗺️ Map & Spots API Route
// ==========================================
app.get('/api/spots', async (req, res) => {
  try {
    let spots = await Spot.find();
    if (spots.length === 0) {
      const defaultSpots = [
        {
          name: 'Lalbagh Fort',
          mainImage: 'https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg',
          location: 'Old Dhaka',
          lat: 23.7198, lng: 90.3883,
          description: 'A 17th-century Mughal fort complex.',
          sliderImages: ['https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg']
        },
        {
          name: "Cox's Bazar",
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cox%27s_Bazar.jpg/1280px-Cox%27s_Bazar.jpg',
          location: 'Chittagong',
          lat: 21.4272, lng: 92.0058,
          description: 'The longest natural sea beach in the world.',
          sliderImages: ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cox%27s_Bazar.jpg/1280px-Cox%27s_Bazar.jpg']
        }
      ];
      await Spot.insertMany(defaultSpots);
      spots = await Spot.find();
    }
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('Database connection failed ❌:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));