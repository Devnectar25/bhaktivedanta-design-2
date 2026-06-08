const fs = require('fs');
const path = 'src/Admin Panel html code/admin-common.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/    \{ name: 'Emergency Services', icon: 'emergency', href: 'emergency-services.html' \},\r?\n/g, '');
fs.writeFileSync(path, content);
