#!/usr/bin/env node

// Set environment variables to skip native binary downloads
process.env.SKIP_DOWNLOAD_BINARY = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_SKIP_NATIVE_POSTINSTALL = '1';
process.env.SWC_BINARY_PATH = 'skip';
process.env.NEXT_SWC_PATH = 'skip';
process.env.SWC_SKIP_DOWNLOAD = '1';

const { execSync } = require('child_process');

try {
  console.log('Starting Next.js build with binary skip configuration...');
  console.log('Environment variables set:');
  console.log('- SKIP_DOWNLOAD_BINARY:', process.env.SKIP_DOWNLOAD_BINARY);
  console.log('- NEXT_TELEMETRY_DISABLED:', process.env.NEXT_TELEMETRY_DISABLED);
  console.log('- NEXT_SKIP_NATIVE_POSTINSTALL:', process.env.NEXT_SKIP_NATIVE_POSTINSTALL);
  console.log('- SWC_BINARY_PATH:', process.env.SWC_BINARY_PATH);
  
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_DOWNLOAD_BINARY: '1',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_SKIP_NATIVE_POSTINSTALL: '1',
      SWC_BINARY_PATH: 'skip',
      NEXT_SWC_PATH: 'skip',
      SWC_SKIP_DOWNLOAD: '1'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
