import 'dotenv/config';
import mongoose from 'mongoose';
import foodModel from '../models/foodModel.js';
import connectDB from '../config/dp.js';

// Connect to MongoDB using the same method as the main app
connectDB();

// Wait for database connection
await new Promise(resolve => setTimeout(resolve, 2000));

const checkCloudinaryItems = async () => {
  try {
    console.log('Checking Cloudinary items specifically...\n');

    // Find items that have Cloudinary URLs
    const cloudinaryItems = await foodModel.find({ 
      'image.url': { $exists: true, $regex: 'cloudinary' } 
    });

    console.log(`Found ${cloudinaryItems.length} items using Cloudinary:\n`);

    cloudinaryItems.forEach((food, index) => {
      console.log(`--- Cloudinary Item ${index + 1} ---`);
      console.log(`Name: ${food.name}`);
      console.log(`Category: ${food.category}`);
      console.log(`Price: ₹${food.price}`);
      console.log(`Image URL: ${food.image.url}`);
      console.log(`Public ID: ${food.image.public_id}`);
      console.log(`Created: ${food.createdAt || 'No timestamp'}`);
      console.log('');
    });

    // Also check for items with problematic image structure
    console.log('\n--- Checking for problematic items ---');
    
    const emptyImageItems = await foodModel.find({
      $or: [
        { 'image.url': { $exists: false } },
        { 'image.url': '' },
        { 'image.url': null }
      ]
    }).limit(5);

    console.log(`Found ${emptyImageItems.length} items with empty/missing image URLs (showing first 5):`);
    
    emptyImageItems.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name} - Image: ${JSON.stringify(food.image)}`);
    });

  } catch (error) {
    console.error('Error checking items:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkCloudinaryItems();
