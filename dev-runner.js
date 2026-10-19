import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('   🚀 LIMO — ENGINEERING PROJECT HUB');
console.log('   Starting Full-Stack Platform Services...');
console.log('====================================================');

// 1. Launch Express Backend Server on Port 5000
const backendProcess = spawn(
  process.execPath,
  [path.join(__dirname, 'server', 'server.js')],
  {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  }
);

backendProcess.on('error', err => {
  console.error('[Backend Process Error]:', err);
});

// 2. Launch Vite Frontend Dev Server on Port 3000
const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
const frontendProcess = spawn(
  process.execPath,
  [viteBin, '--port', '3000', '--host'],
  {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env
  }
);

frontendProcess.on('error', err => {
  console.error('[Frontend Process Error]:', err);
});

const cleanup = () => {
  console.log('\n[LIMO] Shutting down services cleanly...');
  backendProcess.kill();
  frontendProcess.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
