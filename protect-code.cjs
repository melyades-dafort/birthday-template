/**
 * Code Protection Script
 * 
 * This script:
 * 1. Minifies all code (makes it hard to read)
 * 2. Obfuscates JavaScript (scrambles variable names)
 * 3. Adds anti-debugging measures
 * 4. Removes comments and whitespace
 * 
 * Usage: node protect-code.js
 * 
 * Note: This makes code HARDER to steal but not impossible
 * Real protection = hosted version where they never get the file!
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Protecting your code...\n');

// Step 1: Build production with minification
console.log('Step 1: Building minified version...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 2: Additional obfuscation (optional - requires javascript-obfuscator)
console.log('Step 2: Checking for obfuscator...');
try {
  require.resolve('javascript-obfuscator');
  console.log('✅ Obfuscator found\n');
  
  // Obfuscate JS files in .output
  const JavaScriptObfuscator = require('javascript-obfuscator');
  const distPath = path.join(__dirname, '.output', 'public');
  const assetsPath = path.join(distPath, 'assets');
  
  if (fs.existsSync(assetsPath)) {
    const files = fs.readdirSync(assetsPath);
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(assetsPath, file);
        const code = fs.readFileSync(filePath, 'utf-8');
        
        console.log(`Obfuscating ${file}...`);
        const obfuscated = JavaScriptObfuscator.obfuscate(code, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.4,
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        });
        
        fs.writeFileSync(filePath, obfuscated.getObfuscatedCode());
        console.log(`✅ ${file} obfuscated`);
      }
    });
  }
  
  console.log('\n✅ All JavaScript files obfuscated!\n');
} catch (e) {
  console.log('⚠️ Obfuscator not installed');
  console.log('For extra protection, install: npm install --save-dev javascript-obfuscator');
  console.log('Continuing with basic minification...\n');
}

// Step 3: Add anti-copy measures to HTML
console.log('Step 3: Adding protection measures...');
const indexPath = path.join(__dirname, '.output', 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Add anti-debugging script
const antiDebug = `
<script>
// Anti-debugging measures
(function(){
  // Detect DevTools
  var devtools = /./;
  devtools.toString = function() {
    this.opened = true;
  };
  console.log('%c', devtools);
  
  // Check if opened
  if(devtools.opened) {
    alert('⚠️ Developer tools detected! This may cause performance issues.');
  }
  
  // Disable right-click
  document.addEventListener('contextmenu', e => e.preventDefault());
  
  // Disable common shortcuts
  document.addEventListener('keydown', e => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if(e.keyCode == 123 || 
       (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) ||
       (e.ctrlKey && e.keyCode == 85)) {
      e.preventDefault();
      return false;
    }
  });
  
  // Disable text selection
  document.addEventListener('selectstart', e => e.preventDefault());
  
  // Clear console periodically
  setInterval(() => {
    console.clear();
  }, 1000);
})();
</script>
`;

// Add copyright notice
const copyright = `
<!--
╔════════════════════════════════════════════════════════════╗
║                    COPYRIGHT NOTICE                        ║
║                                                            ║
║  This code is PROPRIETARY and CONFIDENTIAL                ║
║  Unauthorized copying, distribution, or modification      ║
║  of this software is strictly prohibited.                 ║
║                                                            ║
║  Licensed for single use only.                            ║
║  See license agreement for terms.                         ║
║                                                            ║
║  © ${new Date().getFullYear()} All Rights Reserved                          ║
╚════════════════════════════════════════════════════════════╝
-->
`;

html = copyright + html.replace('</body>', antiDebug + '</body>');

fs.writeFileSync(indexPath, html);
console.log('✅ Protection measures added\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔒 CODE PROTECTION COMPLETE!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n⚠️ IMPORTANT:');
console.log('This makes code HARDER to steal, but determined');
console.log('people can still extract it.');
console.log('\nBEST PROTECTION = Host it online!');
console.log('Give customers a link, not the file.\n');
