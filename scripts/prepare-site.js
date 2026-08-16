'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public');
const publicFiles = ['index.html', 'app.js', 'tailwind-output.css'];

if (path.dirname(outputDir) !== projectRoot || path.basename(outputDir) !== 'public') {
  throw new Error('مسار مجلد النشر غير آمن');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

publicFiles.forEach((fileName) => {
  fs.copyFileSync(path.join(projectRoot, fileName), path.join(outputDir, fileName));
});

fs.cpSync(path.join(projectRoot, 'images'), path.join(outputDir, 'images'), {
  recursive: true,
  filter(source) {
    return !path.basename(source).startsWith('.');
  }
});

console.log('تم تجهيز مجلد نشر آمن داخل public.');
