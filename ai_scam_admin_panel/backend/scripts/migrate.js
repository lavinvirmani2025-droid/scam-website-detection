const fs = require('fs');
const path = require('path');
console.log('Running placeholder migrations...');
fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../data/README.txt'), 'This is where DB dumps and datasets would be stored.');
console.log('Migrations complete.');
