const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path');

// 1. LOAD ENVIRONMENT VARIABLES FIRST
dotenv.config();

const Spot = require('./models/Spot');
const seedSpots = require('./data/seedSpots');

const app = express();

// 2. MIDDLEWARE
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// 3. CONFIGURE OPENAI IMMEDIATELY AFTER DOTENV
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

if (process.env.OPENAI_BASE_URL) {
  openaiConfig.baseURL = process.env.OPENAI_BASE_URL;
} else {
  openaiConfig.baseURL = 'https://openrouter.ai/api/v1';
}

const openai = new OpenAI(openaiConfig);

const LANGUAGE_NAME_MAP = {
  bn: 'Bengali',
  en: 'English',
  bengali: 'Bengali',
  bangla: 'Bengali',
  english: 'English',
};

const detectLanguageCode = (value = '') => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'bn' || normalized === 'bengali' || normalized === 'bangla' ? 'bn' : 'en';
};

const containsBanglaText = (value = '') => /[\u0980-\u09FF]/.test(String(value || ''));

const buildTranslationFallback = (text, sourceLanguage, targetLanguage) => {
  if (!String(text || '').trim()) {
    return '';
  }

  if (sourceLanguage === targetLanguage) {
    return String(text);
  }

  if (sourceLanguage === 'bn' && targetLanguage === 'en') {
    return `Translation service is temporarily unavailable. Bengali text received: ${text}`;
  }

  if (sourceLanguage === 'en' && targetLanguage === 'bn') {
    return `ট্রান্সলেশন সার্ভিস এখন সাময়িকভাবে বন্ধ আছে। ইংরেজি লেখা পাওয়া গেছে: ${text}`;
  }

  return String(text);
};

const translateText = async ({
  text,
  sourceLanguage = 'auto',
  targetLanguage = 'en',
}) => {
  const normalizedText = String(text || '').trim();
  const normalizedTarget = detectLanguageCode(targetLanguage);
  const normalizedSource =
    sourceLanguage === 'auto'
      ? containsBanglaText(normalizedText)
        ? 'bn'
        : 'en'
      : detectLanguageCode(sourceLanguage);

  if (!normalizedText) {
    return { translatedText: '', sourceLanguage: normalizedSource, targetLanguage: normalizedTarget };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a translation engine. Translate the user's text from ${LANGUAGE_NAME_MAP[normalizedSource]} to ${LANGUAGE_NAME_MAP[normalizedTarget]}. Return only the translated text with no explanation.`,
        },
        { role: 'user', content: normalizedText },
      ],
    });

    return {
      translatedText: completion.choices[0].message.content?.trim() || normalizedText,
      sourceLanguage: normalizedSource,
      targetLanguage: normalizedTarget,
    };
  } catch (error) {
    return {
      translatedText: buildTranslationFallback(
        normalizedText,
        normalizedSource,
        normalizedTarget
      ),
      sourceLanguage: normalizedSource,
      targetLanguage: normalizedTarget,
    };
  }
};

const getChatFallbackReply = async (message, language = 'en') => {
  const normalizedMessage = String(message || '').toLowerCase();
  const spots = await Spot.find().select('name location category description estimatedBudget').lean();

  const includesAny = (keywords) => keywords.some((keyword) => normalizedMessage.includes(keyword));
  const matchedSpots = spots
    .filter((spot) => {
      const haystack = `${spot.name} ${spot.location} ${spot.category} ${spot.description}`.toLowerCase();
      return normalizedMessage
        .split(/\s+/)
        .filter(Boolean)
        .some((term) => term.length > 2 && haystack.includes(term));
    })
    .slice(0, 3);

  const naturalSpots = spots.filter((spot) => spot.category === 'Natural').slice(0, 2);
  const historicalSpots = spots.filter((spot) => spot.category === 'Historical').slice(0, 2);

  const isPackingQuestion = includesAny([
    'carry',
    'bring',
    'pack',
    'packing',
    'wear',
    'need with me',
    'take with me',
    'what should i take',
  ]);
  const isSafetyQuestion = includesAny(['safe', 'safety', 'careful', 'risk', 'danger']);
  const isBudgetQuestion = includesAny(['budget', 'cheap', 'cost', 'price', 'afford']);
  const isTransportQuestion = includesAny(['route', 'go', 'reach', 'transport', 'bus', 'train', 'how to get']);
  const isPlaceQuestion = includesAny([
    'suggest',
    'recommend',
    'place',
    'spot',
    'destination',
    'where should',
    'where can',
    'nearby',
    'visit',
    'tour',
  ]);

  if (language === 'bn') {
    if (isPackingQuestion) {
      return 'ভ্রমণে হালকা কাপড়, পানি, সানস্ক্রিন, প্রয়োজনীয় ওষুধ, পাওয়ার ব্যাংক, ছাতা বা রেইনকোট, আর আরামদায়ক জুতা সঙ্গে রাখুন। পাহাড় বা প্রকৃতির জায়গায় গেলে মশার স্প্রে আর ছোট টর্চও কাজে লাগে।';
    }

    if (isSafetyQuestion) {
      return 'নিরাপত্তার জন্য রাতে নির্জন জায়গা এড়িয়ে চলুন, ফোন চার্জে রাখুন, পানি ও প্রয়োজনীয় ওষুধ সঙ্গে রাখুন, আর স্থানীয় আবহাওয়া ও যাতায়াত পরিস্থিতি আগে দেখে নিন।';
    }

    if (isBudgetQuestion) {
      return 'কম বাজেটে ভ্রমণের জন্য লোকাল ট্রান্সপোর্ট ব্যবহার করুন, আগেই থাকার জায়গা ঠিক করুন, আর জনপ্রিয় পর্যটন এলাকার বাইরে স্থানীয় খাবারের দোকান বেছে নিন। চাইলে আমি ১ দিনের বা ২ দিনের কম বাজেটের প্ল্যানও সাজিয়ে দিতে পারি।';
    }

    if (isTransportQuestion) {
      return 'যাতায়াতের জন্য আগে গন্তব্য অনুযায়ী বাস, ট্রেন বা লোকাল ট্রান্সপোর্ট দেখে নিন। সকালে রওনা দিলে সাধারণত সময় ও ভিড় দুইটাই কম হয়। চাইলে আপনি কোন জায়গায় যেতে চান বললে আমি রুট সাজিয়ে দিতে পারি।';
    }

    if (isPlaceQuestion && matchedSpots.length > 0) {
      return `এই জায়গাগুলো আপনার প্রশ্নের সাথে বেশি মিলে: ${matchedSpots
        .map((spot) => `${spot.name} (${spot.location})`)
        .join(', ')}। চাইলে আমি বাজেট, যাতায়াত বা কাছাকাছি আরেকটি জায়গার সাজেশনও দিতে পারি।`;
    }

    return `আমি এখন লাইভ AI উত্তর দিতে পারছি না, তবে আপনি ${historicalSpots
      .map((spot) => spot.name)
      .join(', ')} এর মতো ঐতিহাসিক জায়গা বা ${naturalSpots
      .map((spot) => spot.name)
      .join(', ')} এর মতো প্রাকৃতিক জায়গা দেখতে পারেন।`;
  }

  if (isPackingQuestion) {
    return 'Carry light clothes, drinking water, sunscreen, basic medicines, a power bank, an umbrella or raincoat, and comfortable shoes. For hill or nature trips, mosquito spray and a small flashlight are also useful.';
  }

  if (isSafetyQuestion) {
    return 'For safety, avoid isolated areas at night, keep your phone charged, carry water and essential medicines, and check local weather and transport conditions before you leave.';
  }

  if (isBudgetQuestion) {
    return 'For a lower-budget trip, use local transport, book stays in advance, and choose local food spots outside the busiest tourist zones. If you want, I can suggest a cheap 1-day or 2-day Bangladesh trip plan.';
  }

  if (isTransportQuestion) {
    return 'Check buses, trains, or local transport based on your destination, and try to start early in the day to avoid traffic and crowds. If you tell me the place name, I can suggest a simple route.';
  }

  if (isPlaceQuestion && matchedSpots.length > 0) {
    return `These places match your request best: ${matchedSpots
      .map((spot) => `${spot.name} (${spot.location})`)
      .join(', ')}. If you want, I can also suggest budget tips or nearby alternatives.`;
  }

  return `I can't reach the live AI service right now, but you can try historical places like ${historicalSpots
    .map((spot) => spot.name)
    .join(', ')} or natural spots like ${naturalSpots
    .map((spot) => spot.name)
    .join(', ')}.`;
};

// 4. ROUTES
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// ✅ EXISTING ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);

// ✅ NEW REVIEW ROUTE (NO CONFLICT)
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 5. CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
  const { message, language = 'en' } = req.body;

  try {
    const targetLanguage = language === 'bn' ? 'Bengali' : 'English';

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful travel assistant named Genie for Explore with Genie. Reply only in ${targetLanguage}. Help with travel questions, itinerary planning, safety tips, route guidance, and budget advice focused on Bangladesh. If the user asks for translation between Bengali and English, translate accurately and return only the translated answer in ${targetLanguage}.`,
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);

    const fallbackReply = await getChatFallbackReply(message, language);
    res.json({ reply: fallbackReply });
  }
});

app.post('/api/translate', async (req, res) => {
  const { text, sourceLanguage = 'auto', targetLanguage = 'en' } = req.body;

  if (!String(text || '').trim()) {
    return res.status(400).json({ message: 'Text is required for translation.' });
  }

  try {
    const result = await translateText({ text, sourceLanguage, targetLanguage });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Translation service failed.' });
  }
});

// 6. SPOT ENDPOINTS
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
    if (!spot) return res.status(404).json({ message: 'Spot not found' });
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/seed-spots', async (req, res) => {
  try {
    await Spot.deleteMany({});
    await Spot.insertMany(seedSpots);
    res.send(`${seedSpots.length} tourist spots reseeded successfully.`);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// 7. DATABASE & SERVER START
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
