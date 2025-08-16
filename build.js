#!/usr/bin/env node

// Set environment variables to skip native binary downloads
process.env.SKIP_DOWNLOAD_BINARY = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_SKIP_NATIVE_POSTINSTALL = '1';
process.env.SWC_BINARY_PATH = 'skip';

const { execSync } = require('child_process');

try {
  console.log('Starting Next.js build with binary skip configuration...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
