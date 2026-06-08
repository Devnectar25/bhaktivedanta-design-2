const fs = require('fs');
const path = require('path');

const directory = 'src/Admin Panel html code';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('style="font-size: 75%;"')) {
        content = content.replace('style="font-size: 75%;"', '');
        fs.writeFileSync(filePath, content);
        console.log(`Removed scaling from ${file}`);
    }
});
console.log('Finished removing global scaling.');
