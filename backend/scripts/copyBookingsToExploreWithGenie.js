const mongoose = require('mongoose');

const MONGO_HOST = 'mongodb://127.0.0.1:27017';
const SOURCE_DB = 'GenieDB';
const TARGET_DB = 'ExploreWithGenie';
const COLLECTION = 'bookings';

async function copyBookings() {
  const sourceConnection = await mongoose.createConnection(
    `${MONGO_HOST}/${SOURCE_DB}`
  ).asPromise();
  const targetConnection = await mongoose.createConnection(
    `${MONGO_HOST}/${TARGET_DB}`
  ).asPromise();

  try {
    const sourceCollection = sourceConnection.collection(COLLECTION);
    const targetCollection = targetConnection.collection(COLLECTION);

    // Upsert by _id so repeated runs are safe and do not duplicate bookings.
    const docs = await sourceCollection.find({}).toArray();

    let copied = 0;
    for (const doc of docs) {
      await targetCollection.replaceOne({ _id: doc._id }, doc, { upsert: true });
      copied += 1;
    }

    console.log(
      `Copied ${copied} bookings from ${SOURCE_DB}.${COLLECTION} to ${TARGET_DB}.${COLLECTION}.`
    );
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

copyBookings().catch((error) => {
  console.error('Booking copy failed:', error.message);
  process.exit(1);
});
