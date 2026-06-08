const fs = require('fs');
try {
    const html = fs.readFileSync('src/Admin Panel html code/specialities.html', 'utf8');
    const bMain = html.indexOf('id="builderMain"');
    console.log("builderMain index:", bMain);
    if (bMain !== -1) {
        console.log(html.substring(bMain - 50, bMain + 200));
    }
} catch (err) {
    console.error(err);
}
