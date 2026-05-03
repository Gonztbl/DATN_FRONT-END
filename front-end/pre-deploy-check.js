#!/usr/bin/env node

/**
 * Pre-deployment Check Script
 * Kiểm tra các vấn đề phổ biến trước khi deploy lên production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let hasErrors = false;
let hasWarnings = false;

function error(message) {
  console.log(`${RED}❌ ERROR: ${message}${RESET}`);
  hasErrors = true;
}

function warning(message) {
  console.log(`${YELLOW}⚠️  WARNING: ${message}${RESET}`);
  hasWarnings = true;
}

function success(message) {
  console.log(`${GREEN}✅ ${message}${RESET}`);
}

function info(message) {
  console.log(`${BLUE}ℹ️  ${message}${RESET}`);
}

console.log('\n' + '='.repeat(60));
console.log('🔍 Pre-Deployment Check');
console.log('='.repeat(60) + '\n');

// 1. Kiểm tra file vercel.json
info('Checking routing configuration...');
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  success('vercel.json exists (Vercel routing configured)');
} else {
  error('vercel.json not found! Users will get 404 on page refresh.');
  info('  Create vercel.json with: {"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}');
}

// 2. Kiểm tra file _redirects
const redirectsPath = path.join(__dirname, 'public', '_redirects');
if (fs.existsSync(redirectsPath)) {
  success('public/_redirects exists (Netlify routing configured)');
} else {
  warning('public/_redirects not found (only needed for Netlify)');
}

// 3. Kiểm tra .env.production
info('\nChecking environment configuration...');
const envProdPath = path.join(__dirname, '.env.production');
if (fs.existsSync(envProdPath)) {
  const envContent = fs.readFileSync(envProdPath, 'utf8');
  
  if (envContent.includes('VITE_API_URL')) {
    const apiUrlMatch = envContent.match(/VITE_API_URL=(.+)/);
    if (apiUrlMatch) {
      const apiUrl = apiUrlMatch[1].trim();
      
      if (apiUrl.includes('your-backend') || apiUrl.includes('localhost')) {
        error('.env.production contains placeholder URL!');
        info(`  Current: ${apiUrl}`);
        info('  Update with actual backend URL: https://your-actual-backend.onrender.com');
      } else if (!apiUrl.startsWith('https://')) {
        error('.env.production API URL must use HTTPS in production!');
        info(`  Current: ${apiUrl}`);
        info('  Change to: https://...');
      } else {
        success(`.env.production configured with: ${apiUrl}`);
      }
    }
  } else {
    error('.env.production missing VITE_API_URL!');
  }
} else {
  error('.env.production not found!');
  info('  Copy .env.production.example and update with actual values');
}

// 4. Kiểm tra .gitignore
info('\nChecking .gitignore...');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  if (gitignoreContent.includes('.env.production') || gitignoreContent.includes('.env*')) {
    success('.gitignore includes .env files');
  } else {
    warning('.gitignore should include .env files to prevent committing secrets');
  }
} else {
  warning('.gitignore not found');
}

// 5. Kiểm tra dist folder
info('\nChecking build output...');
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  const distFiles = fs.readdirSync(distPath);
  if (distFiles.length > 0) {
    success('dist/ folder exists with build output');
    
    // Kiểm tra kích thước file JS
    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const jsFiles = fs.readdirSync(assetsPath).filter(f => f.endsWith('.js'));
      const largeFiles = jsFiles.filter(f => {
        const stats = fs.statSync(path.join(assetsPath, f));
        return stats.size > 500 * 1024; // > 500KB
      });
      
      if (largeFiles.length > 0) {
        warning(`Found ${largeFiles.length} JavaScript file(s) larger than 500KB`);
        largeFiles.forEach(f => {
          const stats = fs.statSync(path.join(assetsPath, f));
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          info(`  - ${f}: ${sizeMB} MB`);
        });
        info('  Consider implementing code splitting (see OPTIMIZATION_GUIDE.md)');
      }
    }
  } else {
    warning('dist/ folder is empty. Run "npm run build" first.');
  }
} else {
  warning('dist/ folder not found. Run "npm run build" first.');
}

// 6. Kiểm tra package.json scripts
info('\nChecking package.json scripts...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    success('Build script exists');
  } else {
    error('Build script not found in package.json!');
  }
  
  if (packageJson.scripts && packageJson.scripts.preview) {
    success('Preview script exists (can test build locally)');
  }
}

// 7. Kiểm tra node_modules
info('\nChecking dependencies...');
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  success('node_modules exists');
} else {
  error('node_modules not found! Run "npm install" first.');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60) + '\n');

if (hasErrors) {
  console.log(`${RED}❌ Found critical errors that must be fixed before deployment!${RESET}\n`);
  process.exit(1);
} else if (hasWarnings) {
  console.log(`${YELLOW}⚠️  Found warnings. Review them before deployment.${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${GREEN}✅ All checks passed! Ready for deployment.${RESET}\n`);
  console.log('Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Test: npm run preview');
  console.log('3. Deploy: vercel --prod (or your deployment command)');
  console.log('\nSee DEPLOYMENT_GUIDE.md for detailed instructions.\n');
  process.exit(0);
}
