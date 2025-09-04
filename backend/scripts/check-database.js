import 'dotenv/config';
import mongoose from 'mongoose';
import foodModel from '../models/foodModel.js';
import connectDB from '../config/dp.js';

// Connect to MongoDB using the same method as the main app
connectDB();

// Wait for database connection
await new Promise(resolve => setTimeout(resolve, 2000));

const checkDatabase = async () => {
  try {
    console.log('Checking database for food items...\n');

    const foods = await foodModel.find({}).limit(10);
    console.log(`Found ${foods.length} food items\n`);

    foods.forEach((food, index) => {
      console.log(`--- Food Item ${index + 1} ---`);
      console.log(`Name: ${food.name}`);
      console.log(`Category: ${food.category}`);
      console.log(`Price: ₹${food.price}`);
      console.log(`Image Type:`, typeof food.image);
      
      if (typeof food.image === 'object') {
        console.log(`Image URL: ${food.image.url || 'Not set'}`);
        console.log(`Public ID: ${food.image.public_id || 'Not set'}`);
        
        // Check if it's a Cloudinary URL
        if (food.image.url && food.image.url.includes('cloudinary.com')) {
          console.log('✅ This is a Cloudinary URL');
        } else if (food.image.url) {
          console.log('❌ This is NOT a Cloudinary URL');
        }
      } else {
        console.log(`Image: ${food.image} (old format)`);
        console.log('❌ This is using the old local image format');
      }
      
      console.log(`Created: ${food.createdAt || 'No timestamp'}`);
      console.log(''); // Empty line for readability
    });

    // Check for mixed formats
    const cloudinaryItems = await foodModel.countDocuments({ 'image.url': { $exists: true, $regex: 'cloudinary' } });
    const localItems = await foodModel.countDocuments({ image: { $type: 'string' } });
    const totalItems = await foodModel.countDocuments({});

    console.log('\n--- Summary ---');
    console.log(`Total food items: ${totalItems}`);
    console.log(`Items using Cloudinary: ${cloudinaryItems}`);
    console.log(`Items using local images: ${localItems}`);
    console.log(`Items with other format: ${totalItems - cloudinaryItems - localItems}`);

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkDatabase();
