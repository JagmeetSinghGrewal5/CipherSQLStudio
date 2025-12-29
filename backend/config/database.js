// Database Configuration
// Handles connections to both PostgreSQL (for SQL sandbox) and MongoDB (for app data)
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// PostgreSQL connection pool - this is where students run their SQL queries
// Supports both individual parameters and connection strings (for Neon)
const pgPool = new Pool(
  process.env.DATABASE_URL ? 
  {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased for cloud connections
  } : 
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'sql_sandbox',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    ssl: process.env.POSTGRES_HOST && process.env.POSTGRES_HOST !== 'localhost' ? {
      rejectUnauthorized: false,
      require: true
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }
);

// Test PostgreSQL connection on startup
pgPool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL (Neon)');
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

// MongoDB connection - stores assignments, user progress, etc.
let mongoClient;
let mongoDb;

const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    mongoDb = mongoClient.db();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const getPostgreSQL = () => pgPool;
const getMongoDB = () => mongoDb;

// Initialize MongoDB connection on startup
connectMongoDB().catch(console.error);

// Graceful shutdown - clean up connections when app closes
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await pgPool.end();
  if (mongoClient) {
    await mongoClient.close();
  }
  console.log('👋 Database connections closed');
  process.exit(0);
});

module.exports = {
  getPostgreSQL,
  getMongoDB,
};

