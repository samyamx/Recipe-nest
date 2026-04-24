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

    const newRecipesPath = path.resolve(__dirname, 'new_recipes.json')
    if (!fs.existsSync(newRecipesPath)) {
      console.error('new_recipes.json not found in scripts/')
      process.exit(1)
    }

    const newRecipes = JSON.parse(fs.readFileSync(newRecipesPath, 'utf8'))

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db()
    const recipes = db.collection('recipes')

    let inserted = 0
    for (const r of newRecipes) {
      const exists = await recipes.findOne({ id: r.id })
      if (exists) continue
      await recipes.insertOne(r)
      inserted++
    }

    console.log(`Inserted ${inserted} new recipe(s)`)
    await client.close()
    process.exit(0)
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
