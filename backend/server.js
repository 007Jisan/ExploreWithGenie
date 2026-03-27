const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const path = require('path'); 

const Spot = require('./models/Spot'); 
const User = require('./models/User');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🟢 লোকাল ছবি সার্ভ করার জন্য স্ট্যাটিক ফোল্ডার
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ==========================================
// 🤖 Module 2: AI Travel Assistant
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
      model: "nvidia/nemotron-3-super-120b-a12b:free", 
      messages: [
        { 
          role: "system", 
          content: `You are a helpful travel assistant named 'Genie' for 'Explore with Genie'. 
          Reply ONLY in ${targetLanguage}. Keep your answers very short and friendly.`
        },
        { role: "user", content: message }
      ],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.json({ reply: language === 'bn' ? "জিনি ব্যস্ত ভাই।" : "I'm busy, sorry!" });
  }
});

// ==========================================
// 🎯 Ratings, Reviews & Recommendations
// ==========================================
app.get('/api/spots', async (req, res) => {
    try {
      const spots = await Spot.find();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
});

app.post('/api/spots/:id/reviews', async (req, res) => {
    try {
      const spot = await Spot.findById(req.params.id);
      if (!spot) return res.status(404).json({ message: "Spot not found" });
      const newReview = { userName: req.body.userName || "Genie Tourist", rating: Number(req.body.rating), comment: req.body.comment };
      spot.reviews.push(newReview);
      await spot.save();
      res.status(201).json({ message: "Review added!", spot });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
});

app.post('/api/users/:id/preferences', async (req, res) => {
  try {
    const { budgetPreference, tripDurationPreference, searchItem } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (budgetPreference) user.budgetPreference = budgetPreference;
    if (tripDurationPreference) user.tripDurationPreference = tripDurationPreference;
    if (searchItem && !user.searchHistory.includes(searchItem)) {
        user.searchHistory.push(searchItem);
        if(user.searchHistory.length > 5) user.searchHistory.shift(); 
    }
    await user.save();
    res.json({ message: "Preferences saved!", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get('/api/users/:id/recommendations', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const spots = await Spot.find();

    let recommendedSpots = spots.filter(spot => {
      let matchScore = 0;
      if (user.budgetPreference === 'Low' && spot.estimatedBudget.includes('500')) matchScore += 2;
      if (user.budgetPreference === 'High' && spot.estimatedBudget.includes('5000')) matchScore += 2;
      user.searchHistory.forEach(history => {
        if (spot.name.toLowerCase().includes(history.toLowerCase()) || spot.location.toLowerCase().includes(history.toLowerCase())) {
          matchScore += 3; 
        }
      });
      return matchScore > 0;
    });

    if (recommendedSpots.length === 0) recommendedSpots = spots.slice(0, 2);
    res.json(recommendedSpots);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ==========================================
// 🚀 Seed Route (১৪টি স্পট স্ক্রিনশট থেকে অফলাইন, ১টি অনলাইন)
// ==========================================
app.get('/api/seed-spots', async (req, res) => {
  try {
    await Spot.deleteMany({}); 

    const local = "http://localhost:5000/images/";

    const premiumSpots = [
      {
        name: 'Lalbagh Fort', nameBN: 'লালবাগ কেল্লা',
        // 🟢 এটি আপনার ফোল্ডারে নেই, তাই অনলাইন রাখা হলো
        mainImage: 'https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg',
        sliderImages: ['https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg'],
        location: 'Old Dhaka', locationBN: 'পুরান ঢাকা',
        lat: 23.7198, lng: 90.3883,
        description: 'Lalbagh Fort is an incomplete 17th-century Mughal fort complex.',
        descriptionBN: '১৭শ শতকের মোগল আমলের একটি অসম্পূর্ণ দুর্গ।',
        bestVisitingTime: 'November to March', estimatedBudget: '500 BDT', nearbyHotels: 'Hotel 71', safetyTips: 'Beware of pickpockets.'
      },
      {
        name: "Cox's Bazar", nameBN: 'কক্সবাজার',
        // 🟢 coxsbazar.jpg
        mainImage: `${local}coxsbazar.jpg`, 
        sliderImages: [`${local}coxsbazar.jpg`],
        location: 'Chittagong Division', locationBN: 'চট্টগ্রাম বিভাগ',
        lat: 21.4272, lng: 92.0058,
        description: 'The longest natural unbroken sea beach in the world.',
        descriptionBN: 'বিশ্বের দীর্ঘতম প্রাকৃতিক সমুদ্র সৈকত।',
        bestVisitingTime: 'Oct-Mar', estimatedBudget: '5000 BDT', nearbyHotels: 'Sayeman Resort', safetyTips: 'Do not swim far during high tide.'
      },
      {
        name: 'Ratargul Swamp Forest', nameBN: 'রাতারগুল জলাবন',
        // 🟢 ratargul.jpg
        mainImage: `${local}ratargul.jpg`, 
        sliderImages: [`${local}ratargul.jpg`],
        location: 'Sylhet', locationBN: 'সিলেট',
        lat: 25.0022, lng: 91.9702,
        description: 'Only freshwater swamp forest in Bangladesh.',
        descriptionBN: 'বাংলাদেশের একমাত্র মিঠাপানির জলাবন।',
        bestVisitingTime: 'July-Oct', estimatedBudget: '3000 BDT', nearbyHotels: 'Grand Sylhet', safetyTips: 'Beware of snakes.'
      },
      {
        name: 'Ahsan Manzil', nameBN: 'আহসান মঞ্জিল',
        // 🟢 ahsanmanjil.jpg
        mainImage: `${local}ahsanmanjil.jpg`, 
        sliderImages: [`${local}ahsanmanjil.jpg`],
        location: 'Kumartoli, Dhaka', locationBN: 'কুমারটুলি, ঢাকা',
        lat: 23.7086, lng: 90.4060,
        description: 'The official residential palace of the Nawab of Dhaka.',
        descriptionBN: 'ঢাকার নবাবদের সাবেক সরকারি বাসভবন।',
        bestVisitingTime: 'Anytime', estimatedBudget: '300 BDT', nearbyHotels: 'Pan Pacific', safetyTips: 'Photography inside restricted.'
      },
      {
        name: "Saint Martin's Island", nameBN: 'সেন্টমার্টিন দ্বীপ',
        // 🟢 Saint_Martin_(6).jpg
        mainImage: `${local}Saint_Martin_(6).jpg`,
        sliderImages: [`${local}Saint_Martin_(6).jpg`],
        location: 'Teknaf', locationBN: 'টেকনাফ',
        lat: 20.6270, lng: 92.3222,
        description: 'The only coral island in Bangladesh.',
        descriptionBN: 'বাংলাদেশের একমাত্র প্রবাল দ্বীপ।',
        bestVisitingTime: 'Winter', estimatedBudget: '8000 BDT', nearbyHotels: 'Blue Marine', safetyTips: 'Check ship schedules.'
      },
      {
        name: 'Sundarbans', nameBN: 'সুন্দরবন',
        // 🟢 Sundarban.jpg
        mainImage: `${local}Sundarban.jpg`,
        sliderImages: [`${local}Sundarban.jpg`],
        location: 'Khulna', locationBN: 'খুলনা',
        lat: 21.9497, lng: 89.1833,
        description: 'World\'s largest mangrove forest.',
        descriptionBN: 'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন।',
        bestVisitingTime: 'Winter', estimatedBudget: '10000 BDT', nearbyHotels: 'Eco Resorts', safetyTips: 'Always stay with guide.'
      },
      {
        name: 'Sajek Valley', nameBN: 'সাজেক ভ্যালি',
        // 🟢 Sajek.jpg
        mainImage: `${local}Sajek.jpg`,
        sliderImages: [`${local}Sajek.jpg`],
        location: 'Rangamati', locationBN: 'রাঙ্গামাটি',
        lat: 23.3820, lng: 92.2938,
        description: 'Known as the Queen of Hills.',
        descriptionBN: 'পাহাড়ের রানি বলা হয় সাজেককে।',
        bestVisitingTime: 'Monsoon/Winter', estimatedBudget: '6000 BDT', nearbyHotels: 'Sajek Resort', safetyTips: 'Follow army escort timings.'
      },
      {
        name: 'Bandarban', nameBN: 'বান্দরবান',
        // 🟢 bandarban.jpg
        mainImage: `${local}bandarban.jpg`,
        sliderImages: [`${local}bandarban.jpg`],
        location: 'Bandarban', locationBN: 'বান্দরবান',
        lat: 22.1953, lng: 92.2184,
        description: 'Beautiful mountain ranges like Nilgiri.',
        descriptionBN: 'চমৎকার পাহাড় সারির জন্য বিখ্যাত।',
        bestVisitingTime: 'Winter', estimatedBudget: '5000 BDT', nearbyHotels: 'Venus Resort', safetyTips: 'Be cautious on hilly roads.'
      },
      {
        name: 'Kaptai Lake', nameBN: 'কাপ্তাই লেক',
        // 🟢 kaptai.jpg
        mainImage: `${local}kaptai.jpg`,
        sliderImages: [`${local}kaptai.jpg`],
        location: 'Rangamati', locationBN: 'রাঙ্গামাটি',
        lat: 22.6533, lng: 92.1525,
        description: 'Largest man-made lake in Bangladesh.',
        descriptionBN: 'বাংলাদেশের বৃহত্তম কৃত্রিম হ্রদ।',
        bestVisitingTime: 'Winter', estimatedBudget: '4000 BDT', nearbyHotels: 'Parjatan Motel', safetyTips: 'Wear life jackets.'
      },
      {
        name: 'Alutila Cave', nameBN: 'আলুটিলা গুহা',
        // 🟢 khagrachari.jpg
        mainImage: `${local}khagrachari.jpg`,
        sliderImages: [`${local}khagrachari.jpg`],
        location: 'Khagrachari', locationBN: 'খাগড়াছড়ি',
        lat: 23.1105, lng: 91.9738,
        description: 'A mysterious dark natural cave.',
        descriptionBN: 'একটি রহস্যময় প্রাকৃতিক গুহা।',
        bestVisitingTime: 'Winter', estimatedBudget: '3000 BDT', nearbyHotels: 'Guyamara Resort', safetyTips: 'Floor is slippery.'
      },
      {
        name: 'Shat Gombuj Masjid', nameBN: 'ষাট গম্বুজ মসজিদ',
        // 🟢 shatgambuj.jpg
        mainImage: `${local}shatgambuj.jpg`,
        sliderImages: [`${local}shatgambuj.jpg`],
        location: 'Bagerhat', locationBN: 'বাগেরহাট',
        lat: 22.6744, lng: 89.7415,
        description: 'UNESCO World Heritage Site.',
        descriptionBN: 'ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট।',
        bestVisitingTime: 'Anytime', estimatedBudget: '2000 BDT', nearbyHotels: 'Bagerhat Motel', safetyTips: 'Dress modestly.'
      },
      {
        name: 'Sompur Mahavihara', nameBN: 'সোমপুর মহাবিহার',
        // 🟢 sompur bihar.jpg
        mainImage: `${local}sompur%20bihar.jpg`,
        sliderImages: [`${local}sompur%20bihar.jpg`],
        location: 'Naogaon', locationBN: 'নওগাঁ',
        lat: 25.0323, lng: 88.9769,
        description: 'An ancient Buddhist monastery.',
        descriptionBN: 'প্রাচীন বৌদ্ধ বিহার।',
        bestVisitingTime: 'Winter', estimatedBudget: '3000 BDT', nearbyHotels: 'Naogaon Motel', safetyTips: 'Respect the site.'
      },
      {
        name: 'Bhawal National Park', nameBN: 'ভাওয়াল জাতীয় উদ্যান',
        // 🟢 bhawal national park.jpg
        mainImage: `${local}bhawal%20national%20park.jpg`,
        sliderImages: [`${local}bhawal%20national%20park.jpg`],
        location: 'Gazipur', locationBN: 'গাজীপুর',
        lat: 24.0617, lng: 90.4024,
        description: 'Beautiful Sal forests.',
        descriptionBN: 'ঘন শালবনের চমৎকার স্পট।',
        bestVisitingTime: 'Winter', estimatedBudget: '1000 BDT', nearbyHotels: 'Sarah Resort', safetyTips: 'Don\'t go deep alone.'
      },
      {
        name: 'Safari Park', nameBN: 'সাফারি পার্ক',
        // 🟢 safari park.jpg
        mainImage: `${local}safari%20park.jpg`,
        sliderImages: [`${local}safari%20park.jpg`],
        location: 'Gazipur', locationBN: 'গাজীপুর',
        lat: 24.1839, lng: 90.3957,
        description: 'A massive wildlife park.',
        descriptionBN: 'একটি বিশাল বন্যপ্রাণী পার্ক।',
        bestVisitingTime: 'Winter', estimatedBudget: '2000 BDT', nearbyHotels: 'Atlantis Resort', safetyTips: 'Stay inside the safari bus.'
      },
      {
        name: 'Jaflong', nameBN: 'জাফলং',
        // 🟢 jaflong.jpg
        mainImage: `${local}jaflong.jpg`,
        sliderImages: [`${local}jaflong.jpg`],
        location: 'Sylhet', locationBN: 'সিলেট',
        lat: 25.1634, lng: 92.0151,
        description: 'Renowned for its stone collections and clear river water.',
        descriptionBN: 'পাথর সংগ্রহ এবং স্বচ্ছ নদীর পানির জন্য পরিচিত।',
        bestVisitingTime: 'Autumn', estimatedBudget: '4000 BDT', nearbyHotels: 'Jaflong Inn', safetyTips: 'Do not cross the border.'
      }
    ];

    await Spot.insertMany(premiumSpots);
    res.send("✅ Success! Fixed with exactly 14 Local Images matching your screenshot.");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('Database connection failed ❌:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));