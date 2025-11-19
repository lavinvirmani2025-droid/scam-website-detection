const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
(async ()=>{
  const users = [
    { email: 'admin1@example.com', name: 'Admin One' },
    { email: 'admin2@example.com', name: 'Admin Two' },
    { email: 'admin3@example.com', name: 'Admin Three' }
  ];
  const seeded = users.map(u => ({...u, password_hash: bcrypt.hashSync('ChangeMe123!', 10)}));
  const out = path.join(__dirname, '../data/seeded_admins.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(seeded, null, 2));
  console.log('Seeded admin users written to', out);
})();
