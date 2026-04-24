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
    const recipes = db.collection('recipes')

    // Aggregate category counts
    const agg = await recipes.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    if (!agg || agg.length === 0) {
      console.log('No categories found in recipes collection.')
      await client.close()
      process.exit(0)
    }

    function titleCase(s) {
      return s
        .toLowerCase()
        .split(/[\s_-]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }

    function normalize(s) {
      if (!s || typeof s !== 'string') return s
      let t = s.trim()
      t = t.replace(/\s+/g, ' ')
      t = t.replace(/[\u2018\u2019\u201C\u201D]/g, "'")
      t = t.replace(/\.$/, '')
      t = titleCase(t)
      return t
    }

    const mappings = agg.map(row => {
      const from = row._id ?? 'Unknown'
      const to = normalize(from)
      return { from, to, count: row.count }
    })

    const suggestions = mappings.filter(m => m.from !== m.to)

    const outPath = path.resolve(__dirname, 'category-mappings.json')
    const payload = { generatedAt: new Date().toISOString(), mappings }
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))

    console.log('Wrote suggestion file to scripts/category-mappings.json')
    console.log('\nDetected categories (count):')
    mappings.forEach(m => console.log(`- ${m.from}: ${m.count} -> ${m.to}`))

    if (suggestions.length > 0) {
      console.log('\nSuggested changes:')
      suggestions.forEach(s => console.log(`- ${s.from}  =>  ${s.to}  (${s.count})`))
    } else {
      console.log('\nNo changes suggested; categories already normalized.')
    }

    const shouldApply = process.argv.includes('--apply')

    if (shouldApply) {
      console.log('\nApplying mappings to the database...')
      for (const m of mappings) {
        if (m.from === m.to) continue
        const res = await recipes.updateMany({ category: m.from }, { $set: { category: m.to } })
        console.log(`Updated ${res.modifiedCount} recipe(s): "${m.from}" => "${m.to}"`)
      }
      // Re-generate mappings file after applying
      const newAgg = await recipes.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray()
      const newMappings = newAgg.map(row => ({ from: row._id ?? 'Unknown', to: normalize(row._id), count: row.count }))
      const newPayload = { generatedAt: new Date().toISOString(), mappings: newMappings }
      fs.writeFileSync(outPath, JSON.stringify(newPayload, null, 2))
      console.log('\nApplied mappings and updated scripts/category-mappings.json')
    } else {
      console.log('\nTo apply the mappings run:')
      console.log('  node scripts/normalize_categories.js --apply')
    }

    await client.close()
    process.exit(0)
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err)
    process.exit(1)
  }
})()
