#!/usr/bin/env node

// Set environment variables to completely bypass SWC
process.env.SKIP_DOWNLOAD_BINARY = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_SKIP_NATIVE_POSTINSTALL = '1';
process.env.NEXT_SKIP_SWC = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create mock SWC binaries in multiple locations to prevent downloads
const mockLocations = [
  // Standard node_modules location
  path.join(process.cwd(), 'node_modules', '@next', 'swc-linux-x64-gnu'),
  // Cache location that AWS is trying to use
  '/root/.cache/next-swc',
  // Alternative cache locations
  path.join(process.cwd(), '.next-swc'),
  path.join(process.cwd(), 'node_modules', '.cache', 'next-swc')
];

try {
  console.log('Starting Next.js build with SWC bypass...');
  console.log('Environment variables set:');
  console.log('- SKIP_DOWNLOAD_BINARY:', process.env.SKIP_DOWNLOAD_BINARY);
  console.log('- NEXT_TELEMETRY_DISABLED:', process.env.NEXT_TELEMETRY_DISABLED);
  console.log('- NEXT_SKIP_SWC:', process.env.NEXT_SKIP_SWC);
  
  // Create mock SWC directories and files in all potential locations
  for (const mockDir of mockLocations) {
    try {
      if (!fs.existsSync(mockDir)) {
        fs.mkdirSync(mockDir, { recursive: true });
        console.log('Created mock directory:', mockDir);
      }
      
      const mockFile = path.join(mockDir, 'next-swc.linux-x64-gnu.node');
      if (!fs.existsSync(mockFile)) {
        fs.writeFileSync(mockFile, '// Mock SWC binary to prevent download');
        console.log('Created mock SWC binary:', mockFile);
      }
    } catch (err) {
      console.log('Could not create mock in:', mockDir, err.message);
    }
  }
  
  execSync('npx next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_DOWNLOAD_BINARY: '1',
      NEXT_TELEMETRY_DISABLED: '1',
      NEXT_SKIP_NATIVE_POSTINSTALL: '1',
      NEXT_SKIP_SWC: '1',
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
