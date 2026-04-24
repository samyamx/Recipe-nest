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
    const sessions = db.collection('sessions')

    const user = await users.findOne({ email: 'admin@gmail.com' })
    if (!user) {
      console.log('No user found with email admin@gmail.com')
      await client.close()
      process.exit(0)
    }

    const result = await sessions.deleteMany({ userId: user.id })
    console.log(`Deleted ${result.deletedCount} session(s) for user ${user.email}`)

    await client.close()
    process.exit(0)
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
