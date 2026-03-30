const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Spot = require('../models/Spot');
const seedSpots = require('../data/seedSpots');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

async function reseed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    await Spot.deleteMany({});
    await Spot.insertMany(seedSpots);
    console.log(`${seedSpots.length} spots reseeded successfully.`);
  } catch (error) {
    console.error('Reseed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

reseed();
