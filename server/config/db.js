const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secondhand_marketplace';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`⚠️ [MongoDB Connection Warning]: ${error.message}`);
    console.log(`ℹ️ [Tip for Student Viva / Demo]:`);
    console.log(`   - If you have MongoDB installed locally, ensure the MongoDB service is started.`);
    console.log(`   - Or paste your free MongoDB Atlas connection string into 'server/.env' as MONGODB_URI.`);
    console.log(`   - The REST API will still serve requests and client offline fallback will keep the UI fully functional.`);
  }
};

module.exports = { connectDB, getIsConnected: () => isConnected };
