import 'dotenv/config';
import mongoose from 'mongoose';
import foodModel from '../models/foodModel.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);

const migrateImages = async () => {
  try {
    console.log('Starting image migration to Cloudinary...');

    // Find all food items with old image format (string)
    const foods = await foodModel.find({
      $or: [
        { image: { $type: "string" } },
        { "image.url": { $exists: false } },
        { "image.public_id": { $exists: false } }
      ]
    });

    console.log(`Found ${foods.length} food items to migrate`);

    if (foods.length === 0) {
      console.log('No items need migration. All items are already using Cloudinary format.');
      process.exit(0);
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const food of foods) {
      try {
        console.log(`Migrating: ${food.name}`);

        let imageFilename;
        if (typeof food.image === 'string') {
          imageFilename = food.image;
        } else if (food.image && food.image.filename) {
          imageFilename = food.image.filename;
        } else {
          console.log(`Skipping ${food.name} - no valid image filename`);
          results.failed++;
          continue;
        }

        // Check if the image file exists in uploads directory
        const imagePath = path.join(__dirname, '../uploads', imageFilename);
        
        if (!fs.existsSync(imagePath)) {
          console.log(`Warning: Image file not found for ${food.name}: ${imagePath}`);
          results.failed++;
          results.errors.push(`Image file not found: ${imageFilename} for ${food.name}`);
          continue;
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(imagePath, {
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto:good' }
          ]
        });

        // Update the food item with new image structure
        await foodModel.findByIdAndUpdate(food._id, {
          image: {
            url: uploadResult.url,
            public_id: uploadResult.public_id
          }
        });

        console.log(`✅ Successfully migrated: ${food.name}`);
        results.success++;

      } catch (error) {
        console.error(`❌ Failed to migrate ${food.name}:`, error.message);
        results.failed++;
        results.errors.push(`${food.name}: ${error.message}`);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`✅ Successful migrations: ${results.success}`);
    console.log(`❌ Failed migrations: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach(error => console.log(`- ${error}`));
    }

    console.log('\nMigration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the migration
migrateImages();
