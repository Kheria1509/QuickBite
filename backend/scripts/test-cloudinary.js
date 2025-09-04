import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testCloudinary = async () => {
  try {
    console.log('Testing Cloudinary connection...\n');
    
    console.log('Configuration:');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set'}`);
    console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'}\n`);

    // List resources in the quickbite-foods folder
    console.log('Listing resources in quickbite-foods folder...\n');
    
    const result = await cloudinary.search
      .expression('folder:quickbite-foods')
      .sort_by([['created_at','desc']])
      .max_results(10)
      .execute();

    console.log(`Found ${result.total_count} resources in Cloudinary`);
    
    if (result.resources.length > 0) {
      console.log('\nRecent uploads:');
      result.resources.forEach((resource, index) => {
        console.log(`${index + 1}. Public ID: ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Created: ${resource.created_at}`);
        console.log(`   Size: ${resource.bytes} bytes`);
        console.log('');
      });
    } else {
      console.log('\nNo resources found in the quickbite-foods folder.');
      
      // Try to list all resources
      const allResult = await cloudinary.search
        .sort_by([['created_at','desc']])
        .max_results(10)
        .execute();
        
      console.log(`\nFound ${allResult.total_count} total resources in your account`);
      if (allResult.resources.length > 0) {
        console.log('\nRecent uploads (any folder):');
        allResult.resources.forEach((resource, index) => {
          console.log(`${index + 1}. Public ID: ${resource.public_id}`);
          console.log(`   URL: ${resource.secure_url}`);
          console.log('');
        });
      }
    }

  } catch (error) {
    console.error('Cloudinary test failed:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
};

testCloudinary();
