import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const simpleTest = async () => {
  try {
    console.log('Testing basic Cloudinary connection...\n');
    
    // Simple API ping
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary API connection successful!');
    console.log('API Status:', result.status);
    
    // Try to get account details
    try {
      const usage = await cloudinary.api.usage();
      console.log('\n📊 Account Usage:');
      console.log(`Plan: ${usage.plan}`);
      console.log(`Credits used: ${usage.credits.usage}/${usage.credits.limit}`);
      console.log(`Resources: ${usage.resources}`);
      console.log(`Storage: ${Math.round(usage.storage.usage/1024/1024)}MB used`);
    } catch (usageError) {
      console.log('\n⚠️ Could not fetch usage details:', usageError.message);
    }

    // Try to list some resources
    try {
      console.log('\n🔍 Searching for resources...');
      const resources = await cloudinary.api.resources({
        type: 'upload',
        max_results: 10
      });
      
      console.log(`Found ${resources.total_count} total resources in your account`);
      
      if (resources.resources.length > 0) {
        console.log('\nRecent resources:');
        resources.resources.forEach((resource, index) => {
          console.log(`${index + 1}. ${resource.public_id}`);
          console.log(`   URL: ${resource.secure_url}`);
          console.log(`   Created: ${resource.created_at}`);
          console.log('');
        });
      }
      
    } catch (listError) {
      console.log('\n⚠️ Could not list resources:', listError.message);
    }

  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    console.error('HTTP Status:', error.http_code);
  }
};

simpleTest();
