import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI não está definida no .env')
}

// cache para evitar reconexões no dev
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

// definição global pra não recriar no hot reload
declare global {
  // eslint-disable-next-line no-var
  var mongoose: any
}

global.mongoose = cached

export default connectDB