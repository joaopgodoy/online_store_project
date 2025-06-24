import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env')
}

// cache to avoid reconnections in dev
let cached = global.mongoose || { conn: null, promise: null }

async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

// global definition to avoid recreating on hot reload
declare global {
  // eslint-disable-next-line no-var
  var mongoose: any
}

global.mongoose = cached

export default connectDB