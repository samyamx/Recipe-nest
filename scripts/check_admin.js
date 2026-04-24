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
    console.log('== admin user ==')
    if (!user) {
      console.log('No user found with email admin@gmail.com')
    } else {
      const safe = { ...user }
      if (safe.passwordHash) safe.passwordHash = '<present>'
      if (safe.password) safe.password = '<plain password field present>'
      console.log(JSON.stringify(safe, null, 2))
      const userSessions = await sessions.find({ userId: user.id }).toArray()
      console.log('\n== sessions for this user ==')
      console.log(JSON.stringify(userSessions, null, 2))
    }

    await client.close()
    process.exit(0)
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
