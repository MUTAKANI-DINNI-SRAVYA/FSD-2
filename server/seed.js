require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const sampleProducts = require('./data/sampleProducts');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secondhand_marketplace';

  try {
    console.log(`Connecting to MongoDB for seeding at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Existing products cleared.');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✨ Successfully seeded ${inserted.length} realistic universal marketplace products into MongoDB:`);
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. [${p.category}] ${p.name} — ₹${p.price} (${p.location})`);
    });

    console.log('🌱 Universal marketplace seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
