const mongoose = require('mongoose');

const MONGO_HOST = 'mongodb://127.0.0.1:27017';
const SOURCE_DB = 'ExploreWithGenie';
const TARGET_DB = 'GenieDB';
const COLLECTION = 'spots';

async function copySpots() {
  const sourceConnection = await mongoose.createConnection(
    `${MONGO_HOST}/${SOURCE_DB}`
  ).asPromise();
  const targetConnection = await mongoose.createConnection(
    `${MONGO_HOST}/${TARGET_DB}`
  ).asPromise();

  try {
    const sourceCollection = sourceConnection.collection(COLLECTION);
    const targetCollection = targetConnection.collection(COLLECTION);

    const docs = await sourceCollection.find({}).toArray();

    await targetCollection.deleteMany({});
    if (docs.length > 0) {
      await targetCollection.insertMany(docs);
    }

    console.log(
      `Copied ${docs.length} documents from ${SOURCE_DB}.${COLLECTION} to ${TARGET_DB}.${COLLECTION}.`
    );
  } finally {
    await sourceConnection.close();
    await targetConnection.close();
  }
}

copySpots().catch((error) => {
  console.error('Copy failed:', error.message);
  process.exit(1);
});
