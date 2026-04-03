const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error('MONGO_URL is missing in backend/.env');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(mongoUrl);
  console.log(`MongoDB Connected: ${connection.connection.host}`);
  return connection;
};

module.exports = connectDB;
