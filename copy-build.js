const fs = require('fs-extra');
const path = require('path');

// 项目中的 dist 目录
const distDir = path.resolve(__dirname, 'dist');

// nginx 目录
const nginxDir = 'D:/code/nginx-1.26.0/html/backend';

// 复制 dist 目录到 nginx 目录
fs.copy(distDir, nginxDir)
.then(() => console.log('Build copied to nginx directory successfully!'))
.catch(err => console.error('Error copying build to nginx directory:', err));