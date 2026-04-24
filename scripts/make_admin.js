(async () => {
  try {
    const fs = require('fs')
    const path = require('path')
    const { MongoClient } = require('mongodb')

    const envPath = path.resolve(__dirname, '..', '.env.local')
    let env = ''
    try { env = fs.readFileSync(envPath, 'utf8') } catch (e) {}

    function parseEnv(envText) {
      const obj = {}
      envText.split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m) {
          obj[m[1]] = m[2]
        }
      })
      return obj
    }

    const envVars = parseEnv(env)
    const uri = process.env.MONGODB_URI || envVars.MONGODB_URI
    if (!uri) {
      console.error('MONGODB_URI not found in environment or .env.local')
      process.exit(2)
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()

    const users = db.collection('users')

    const before = await users.findOne({ email: 'admin@gmail.com' })
    console.log('Before:')
    console.log(before ? JSON.stringify(before, null, 2) : 'No user found')

    const res = await users.updateOne({ email: 'admin@gmail.com' }, { $set: { role: 'Admin' } })
    console.log('\nUpdate result:', JSON.stringify(res, null, 2))

    const after = await users.findOne({ email: 'admin@gmail.com' })
    console.log('\nAfter:')
    if (after) {
      const safe = { ...after }
      if (safe.passwordHash) safe.passwordHash = '<present>'
      console.log(JSON.stringify(safe, null, 2))
    }

    await client.close()
    process.exit(0)
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
