const fs = require('fs');
let content = fs.readFileSync('scratch/build-specialities-v2.cjs', 'utf8');

// 1. Add tabs to the mock specialities
content = content.replace(/shortDescription: '(.*?)', status: true \}/g, `shortDescription: '$1', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: '$1'}]}] }`);

// 2. Inject new state variables
content = content.replace(/activeSpecialityId: null,/, `activeSpecialityId: null,
        activeTabId: 't1',`);

fs.writeFileSync('scratch/build-specialities-v2.cjs', content);
console.log('Patched state array in V2 script');
