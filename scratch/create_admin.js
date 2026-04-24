const { MongoClient } = require('mongodb');
const crypto = require('crypto');

async function createAdmin() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/recipe-nest";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    // Check if user exists
    const existing = await users.findOne({ email: 'admin@gmail.com' });
    // create a scrypt-based passwordHash compatible with lib/auth.ts
    const plainPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const salt = crypto.randomBytes(16).toString('hex')
    const derived = crypto.scryptSync(plainPassword, salt, 64).toString('hex')
    const passwordHash = `${salt}:${derived}`

    if (existing) {
      console.log('Admin user already exists. Updating passwordHash and role...');
      await users.updateOne(
        { email: 'admin@gmail.com' },
        {
          $set: {
            passwordHash,
            role: 'Admin',
            name: 'System Admin'
          }
        }
      );
    } else {
      console.log('Creating new admin user...');
      await users.insertOne({
        name: 'System Admin',
        email: 'admin@gmail.com',
        passwordHash,
        role: 'Admin',
        createdAt: new Date(),
        status: 'Active'
      });
    }
    console.log('Successfully created/updated admin@gmail.com');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

createAdmin();
