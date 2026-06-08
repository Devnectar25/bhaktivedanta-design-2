const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('src/Admin Panel html code/specialities.html', 'utf8');
const virtualConsole = new (require('jsdom').VirtualConsole)();
virtualConsole.on("error", (err) => { console.log("JSDOM Error:", err); });
virtualConsole.on("jsdomError", (err) => { console.log("JSDOM jsdomError:", err); });
const dom = new JSDOM(html, { runScripts: "dangerously", virtualConsole });
