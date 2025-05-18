// This script is for debugging Vercel deployments
// It will be executed during the build process

console.log('=============== VERCEL DEPLOYMENT DEBUG INFO ===============');

// Log environment information
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Vercel URL:', process.env.NEXT_PUBLIC_VERCEL_URL);

// Check for data files in the public directory
const fs = require('fs');
const path = require('path');

const publicDataDir = path.join(process.cwd(), 'public/data');

console.log('\nChecking for data files in public/data directory:');

try {
  if (fs.existsSync(publicDataDir)) {
    const files = fs.readdirSync(publicDataDir);
    console.log('Files found:', files);
    
    // Check file contents for first file
    if (files.length > 0) {
      const firstFile = files[0];
      try {
        const stats = fs.statSync(path.join(publicDataDir, firstFile));
        console.log(`File ${firstFile} size: ${stats.size} bytes`);
      } catch (err) {
        console.error(`Error getting file stats: ${err.message}`);
      }
    }
  } else {
    console.log('public/data directory not found!');
  }
} catch (err) {
  console.error('Error checking for data files:', err);
}

console.log('\n==========================================================='); 