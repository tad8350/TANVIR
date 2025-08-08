const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'Admin@123#';
    const hash = await bcrypt.hash(password, 10);
    console.log('Generated hash for default admin password:');
    console.log(hash);
}

generateHash();
