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

// Create a mock SWC binary to prevent downloads
const mockSwcDir = path.join(process.cwd(), 'node_modules', '@next', 'swc-linux-x64-gnu');
const mockSwcFile = path.join(mockSwcDir, 'next-swc.linux-x64-gnu.node');

try {
  console.log('Starting Next.js build with SWC bypass...');
  console.log('Environment variables set:');
  console.log('- SKIP_DOWNLOAD_BINARY:', process.env.SKIP_DOWNLOAD_BINARY);
  console.log('- NEXT_TELEMETRY_DISABLED:', process.env.NEXT_TELEMETRY_DISABLED);
  console.log('- NEXT_SKIP_SWC:', process.env.NEXT_SKIP_SWC);
  
  // Create mock SWC directory and file to prevent download
  if (!fs.existsSync(mockSwcDir)) {
    fs.mkdirSync(mockSwcDir, { recursive: true });
  }
  if (!fs.existsSync(mockSwcFile)) {
    fs.writeFileSync(mockSwcFile, '// Mock SWC binary to prevent download');
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
