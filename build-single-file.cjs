/**
 * Build Script: Creates a single HTML file with all assets embedded
 * 
 * This script:
 * 1. Builds the production version
 * 2. Inlines all CSS, JS, and converts images to base64
 * 3. Creates a single .html file that can be shared via Facebook
 * 
 * Usage: node build-single-file.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎂 Building single-file birthday template...\n');

// Step 1: Build the production version
console.log('📦 Step 1: Building production files...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Read the built HTML
console.log('📄 Step 2: Reading build output...');
const distPath = path.join(__dirname, '.output', 'public');
const indexPath = path.join(distPath, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');
console.log('✅ HTML loaded\n');

// Step 3: Inline CSS files
console.log('🎨 Step 3: Inlining CSS...');
const cssRegex = /<link[^>]+href="([^"]+\.css)"[^>]*>/g;
let cssMatch;
let cssCount = 0;

while ((cssMatch = cssRegex.exec(html)) !== null) {
  const cssFile = cssMatch[1].replace(/^\//, '');
  const cssPath = path.join(distPath, cssFile);
  
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
    cssCount++;
  }
}
console.log(`✅ Inlined ${cssCount} CSS files\n`);

// Step 4: Inline JavaScript files
console.log('⚙️ Step 4: Inlining JavaScript...');
const jsRegex = /<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g;
let jsMatch;
let jsCount = 0;

while ((jsMatch = jsRegex.exec(html)) !== null) {
  const jsFile = jsMatch[1].replace(/^\//, '');
  const jsPath = path.join(distPath, jsFile);
  
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    html = html.replace(jsMatch[0], `<script type="module">${jsContent}</script>`);
    jsCount++;
  }
}
console.log(`✅ Inlined ${jsCount} JavaScript files\n`);

// Step 5: Convert images to base64
console.log('🖼️ Step 5: Converting images to base64...');
const imgRegex = /src="(\/[^"]+\.(jpg|jpeg|png|gif|webp|svg))"/g;
let imgMatch;
let imgCount = 0;

while ((imgMatch = imgRegex.exec(html)) !== null) {
  const imgFile = imgMatch[1].replace(/^\//, '');
  const imgPath = path.join(distPath, imgFile);
  
  if (fs.existsSync(imgPath)) {
    const imgBuffer = fs.readFileSync(imgPath);
    const imgBase64 = imgBuffer.toString('base64');
    const imgExt = path.extname(imgFile).substring(1);
    const mimeType = imgExt === 'svg' ? 'image/svg+xml' : `image/${imgExt}`;
    const dataUrl = `data:${mimeType};base64,${imgBase64}`;
    
    html = html.replace(imgMatch[1], dataUrl);
    imgCount++;
  }
}
console.log(`✅ Converted ${imgCount} images to base64\n`);

// Step 6: Convert audio to base64 (if exists)
console.log('🎵 Step 6: Converting audio to base64...');
const audioRegex = /src="(\/audio\/[^"]+\.mp3)"/g;
let audioMatch;
let audioCount = 0;

while ((audioMatch = audioRegex.exec(html)) !== null) {
  const audioFile = audioMatch[1].replace(/^\//, '');
  const audioPath = path.join(distPath, audioFile);
  
  if (fs.existsSync(audioPath)) {
    const audioBuffer = fs.readFileSync(audioPath);
    const audioBase64 = audioBuffer.toString('base64');
    const dataUrl = `data:audio/mpeg;base64,${audioBase64}`;
    
    html = html.replace(audioMatch[1], dataUrl);
    audioCount++;
  }
}
console.log(`✅ Converted ${audioCount} audio files to base64\n`);

// Step 7: Add metadata and title
console.log('📝 Step 7: Adding metadata...');
const nameMatch = html.match(/for\s+([^<]+)</);
const birthdayName = nameMatch ? nameMatch[1].trim() : 'Someone Special';
const title = `Happy Birthday ${birthdayName}! 🎂`;

html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
html = html.replace('</head>', `
  <meta name="description" content="A special birthday surprise for ${birthdayName}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Open this to see your birthday surprise! 🎁">
  <meta property="og:type" content="website">
</head>`);
console.log(`✅ Added metadata for "${birthdayName}"\n`);

// Step 8: Add comment header
const header = `<!--
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        🎂 HAPPY BIRTHDAY INTERACTIVE EXPERIENCE 🎂            ║
║                                                               ║
║  This is a personalized birthday greeting created with love  ║
║  Simply open this file in any web browser to view!           ║
║                                                               ║
║  Created: ${new Date().toLocaleDateString()}                                      ║
║  For: ${birthdayName.padEnd(52)} ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
-->

`;

html = header + html;

// Step 9: Save the single file
console.log('💾 Step 9: Saving single HTML file...');
const outputName = `birthday-${birthdayName.replace(/\s+/g, '-').toLowerCase()}.html`;
const outputPath = path.join(__dirname, outputName);
fs.writeFileSync(outputPath, html, 'utf-8');

// Get file size
const stats = fs.statSync(outputPath);
const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('✅ Single file created!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📁 Output:', outputName);
console.log('📊 File size:', fileSizeMB, 'MB');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n✨ Ready to send to customer! ✨\n');
console.log('How to use:');
console.log('1. Send this file via Facebook Messenger');
console.log('2. Customer downloads and opens in any browser');
console.log('3. No installation needed - it just works! 🎉\n');
