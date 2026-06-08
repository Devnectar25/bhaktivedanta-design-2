const fs = require('fs');

const path = 'src/Admin Panel html code/admin-common.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/'add-speciality\.html': 'specialities\.html',?\n?\s*/g, '');
content = content.replace(/'specialities\.html': 'add-speciality\.html',?\n?\s*/g, '');

fs.writeFileSync(path, content);
console.log('Successfully patched admin-common.js');
