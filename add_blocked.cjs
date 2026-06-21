const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("active: 'Active',", "active: 'Active',\n    blocked: 'Blocked',");
code = code.replace("active: 'Aktiv',", "active: 'Aktiv',\n    blocked: 'Blockiert',");
code = code.replace("active: 'Aktiv',", "active: 'Aktiv',\n    blocked: 'Bllokuar',"); // Albanian one too

fs.writeFileSync('src/App.tsx', code);
console.log('Done blocked added!');
