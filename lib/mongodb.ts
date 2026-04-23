import "server-only"

import { MongoClient } from "mongodb"

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined
}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

function resetClientState() {
  clientPromise = undefined
  global.__mongoClientPromise__ = undefined
  client = undefined
}

function createClientPromise(uri: string) {
  const nextClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  })

  client = nextClient

  return nextClient.connect().catch(async (error) => {
    resetClientState()

    try {
      await nextClient.close()
    } catch {
      // Ignore close errors after failed connect attempts.
    }

    throw error
  })
}

function getClientPromise() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to your environment variables.")
  }

  if (!clientPromise) {
    if (process.env.NODE_ENV === "development") {
      if (!global.__mongoClientPromise__) {
        global.__mongoClientPromise__ = createClientPromise(uri)
      }

      clientPromise = global.__mongoClientPromise__
    } else {
      clientPromise = createClientPromise(uri)
    }
  }

  return clientPromise
}

export async function getDatabase() {
  try {
    const connectedClient = await getClientPromise()
    return connectedClient.db(process.env.MONGODB_DB || "recipe-nest")
  } catch (error) {
    resetClientState()
    throw error
  }
}

export async function getDatabaseSafely() {
  try {
    return await getDatabase()
  } catch (error) {
    console.error("MongoDB connection failed. Falling back to local seed data.", error)
    return null
  }
}
