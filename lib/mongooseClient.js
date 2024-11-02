const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env.local");
}

/** 
 * Global is used here to maintain a cached connection in development, 
 * otherwise Next.js would reinitialize the connection on every request.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;