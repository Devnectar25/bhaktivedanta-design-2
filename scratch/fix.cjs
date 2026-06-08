const fs = require('fs');
let html = fs.readFileSync('src/Admin Panel html code/add-service.html', 'utf8');
html = html.replace(/\\\$\{/g, '${');
fs.writeFileSync('src/Admin Panel html code/add-service.html', html);
console.log('Fixed escaped variables.');
