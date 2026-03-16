const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 👇 Spot মডেলটা ইম্পোর্ট করা হলো
const Spot = require('./models/Spot'); 

dotenv.config();
const app = express();

// 🛠️ Middleware Setup
app.use(cors()); // Shobar upore thakbe
app.use(express.json());

// 🛣️ Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ==========================================
// 🗺️ Map & Spots API Route (Dynamic Database)
// ==========================================
app.get('/api/spots', async (req, res) => {
  try {
    let spots = await Spot.find();
    
    // ম্যাজিক: ডাটাবেস যদি ফাঁকা থাকে বা পুরনো স্ট্রাকচারের ডাটা থাকে, তাহলে পুরনোটা মুছে নতুন আপডেট করবে!
    if (spots.length === 0 || !spots[0].sliderImages || spots[0].sliderImages.length === 0) {
      await Spot.deleteMany({}); // পুরনো ভুল ডাটা ক্লিন করে দেবে

      const defaultSpots = [
        {
          name: 'Lalbagh Fort',
          mainImage: 'https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg',
          sliderImages: [
            'https://images.pexels.com/photos/34957286/pexels-photo-34957286.jpeg', 
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lalbagh_Fort_Mosque.jpg/1280px-Lalbagh_Fort_Mosque.jpg'
          ],
          location: 'Old Dhaka',
          mapQuery: 'Lalbagh+Fort,+Dhaka',
          lat: 23.7198, lng: 90.3883,
          description: 'An incomplete 17th-century Mughal fort complex that stands proudly before the Buriganga River. Features include the Mausoleum of Pari Bibi, a mosque, and large green gardens.',
          bestVisitingTime: 'Oct to Mar (4 PM - 6 PM)',
          estimatedBudget: '৳500 - ৳1,000 / day',
          nearbyHotels: 'Hotel 71, Pan Pacific Sonargaon',
          safetyTips: 'Beware of pickpockets outside the fort. Carry water.'
        },
        {
          name: "Cox's Bazar",
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cox%27s_Bazar.jpg/1280px-Cox%27s_Bazar.jpg',
          sliderImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Cox%27s_Bazar.jpg/1280px-Cox%27s_Bazar.jpg', 
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Cox%27s_Bazar_Beach_-_03.jpg/1280px-Cox%27s_Bazar_Beach_-_03.jpg'
          ],
          location: 'Chittagong',
          mapQuery: 'Coxs+Bazar+Sea+Beach',
          lat: 21.4272, lng: 92.0058,
          description: 'The longest natural unbroken sea beach in the world (120 km). Famous for its golden sand, surfing waves, seafood, and the beautiful Marine Drive.',
          bestVisitingTime: 'Nov to Feb (Pleasant weather)',
          estimatedBudget: '৳3,000 - ৳6,000 / day',
          nearbyHotels: 'Sayeman Beach Resort, Ocean Paradise',
          safetyTips: 'Follow the red/green flag instructions of the coast guard.'
        },
        {
          name: 'Ahsan Manzil',
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg',
          sliderImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ahsan_Manzil-Front_View.jpg/1280px-Ahsan_Manzil-Front_View.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ahsan_Manzil_side_view.jpg/1280px-Ahsan_Manzil_side_view.jpg'
          ],
          location: 'Old Dhaka',
          mapQuery: 'Ahsan+Manzil,+Dhaka',
          lat: 23.7086, lng: 90.4060,
          description: 'Once the official residential palace of the Nawab of Dhaka. This magnificent pink palace is now a grand national museum showcasing their lavish lifestyle.',
          bestVisitingTime: 'Nov to Mar (Morning hours)',
          estimatedBudget: '৳500 - ৳1,000 / day',
          nearbyHotels: 'InterContinental Dhaka, Hotel Ornate',
          safetyTips: 'Keep belongings safe. Usually closed on Thursdays.'
        },
        {
          name: 'Sompur Bihar',
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg',
          sliderImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Paharpur_Buddhist_Monastery.jpg/1280px-Paharpur_Buddhist_Monastery.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Somapura_Mahavihara.jpg/1280px-Somapura_Mahavihara.jpg'
          ],
          location: 'Naogaon',
          mapQuery: 'Sompur+Mahavihara,+Paharpur',
          lat: 25.0320, lng: 88.9767,
          description: 'A designated UNESCO World Heritage Site. This 8th-century Buddhist monastery in Paharpur features stunning terracotta plaques and a massive central shrine.',
          bestVisitingTime: 'Nov to Mar (Cooler climate)',
          estimatedBudget: '৳1,500 - ৳2,500 / day',
          nearbyHotels: 'Parjatan Motel Bogra, Momo Inn',
          safetyTips: 'The area is large, so carry drinking water and sunscreen.'
        },
        {
          name: 'Sundarban',
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sundarban_Tiger.jpg/1280px-Sundarban_Tiger.jpg',
          sliderImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sundarban_Tiger.jpg/1280px-Sundarban_Tiger.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Sundarban_Canal.jpg/1280px-Sundarban_Canal.jpg'
          ],
          location: 'Khulna',
          mapQuery: 'Sundarbans+National+Park,+Bangladesh',
          lat: 21.9497, lng: 89.1833,
          description: 'The largest contiguous mangrove forest in the world. Proud home to the majestic Royal Bengal Tiger, spotted deer, and crocodiles.',
          bestVisitingTime: 'Nov to Feb (Wildlife spotting)',
          estimatedBudget: '৳6,000 - ৳12,000 (Package tours)',
          nearbyHotels: 'Pashur Resort, Various Eco-resorts',
          safetyTips: 'Stay with your guide. Use strong mosquito repellents.'
        },
        {
          name: 'Saint Martin',
          mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Saint_Martin_%286%29.jpg/1280px-Saint_Martin_%286%29.jpg',
          sliderImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Saint_Martin_%286%29.jpg/1280px-Saint_Martin_%286%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/St_Martin_Island_Beach.jpg/1280px-St_Martin_Island_Beach.jpg'
          ],
          location: 'Bay of Bengal',
          mapQuery: 'St.+Martin+Island,+Bangladesh',
          lat: 20.6232, lng: 92.3234,
          description: 'The only coral island of Bangladesh, famous for its crystal clear blue water, serene coconut groves, and peaceful environment.',
          bestVisitingTime: 'Nov to Feb (Ships operate in winter)',
          estimatedBudget: '৳4,000 - ৳7,000 / day',
          nearbyHotels: 'Coral View Resort, Blue Marine Resort',
          safetyTips: 'Carry cash (no ATMs). Use eco-friendly products to protect corals.'
        }
      ];
      await Spot.insertMany(defaultSpots);
      spots = await Spot.find(); // ইনসার্ট হওয়ার পর আবার ডাটাবেস থেকে আনবে
    }
    
    res.json(spots);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Server Error while fetching spots" });
  }
});

// 🍃 MongoDB Connect
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.error('Database connection failed ❌:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));