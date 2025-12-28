const { Pool } = require('pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';
const PG_CONFIG = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: 'postgres', // Connect to default database first
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

const TARGET_DB = process.env.POSTGRES_DB || 'sql_sandbox';

async function setupMongoDB() {
  try {
    console.log('Setting up MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    
    // Test connection
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connected successfully');
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('assignments')) {
      await db.createCollection('assignments');
      console.log('✅ Created assignments collection');
    }
    
    if (!collectionNames.includes('query_attempts')) {
      await db.createCollection('query_attempts');
      console.log('✅ Created query_attempts collection');
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
    return false;
  }
}

async function setupPostgreSQL() {
  try {
    console.log('Setting up PostgreSQL...');
    
    // Try to connect to default postgres database
    const adminPool = new Pool({
      ...PG_CONFIG,
      database: 'postgres'
    });
    
    // Test connection
    await adminPool.query('SELECT 1');
    console.log('✅ PostgreSQL connection successful');
    
    // Check if database exists
    const dbCheck = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TARGET_DB]
    );
    
    if (dbCheck.rows.length === 0) {
      // Create database
      await adminPool.query(`CREATE DATABASE ${TARGET_DB}`);
      console.log(`✅ Created database: ${TARGET_DB}`);
    } else {
      console.log(`✅ Database ${TARGET_DB} already exists`);
    }
    
    await adminPool.end();
    
    // Now connect to the target database and create tables
    const targetPool = new Pool({
      ...PG_CONFIG,
      database: TARGET_DB
    });
    
    // Create employees table (will be used by seed script)
    await targetPool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        department VARCHAR(50),
        salary DECIMAL(10, 2),
        department_id INT
      );
    `);
    
    // Create departments table
    await targetPool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT PRIMARY KEY,
        name VARCHAR(50),
        location VARCHAR(100)
      );
    `);
    
    console.log('✅ PostgreSQL tables ready');
    await targetPool.end();
    
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL setup failed:', error.message);
    console.error('   Please check:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Credentials in backend/.env are correct');
    console.error('   3. User has permission to create databases');
    return false;
  }
}

async function main() {
  console.log('🚀 Starting automatic setup...\n');
  
  const mongoOk = await setupMongoDB();
  console.log('');
  const pgOk = await setupPostgreSQL();
  
  console.log('\n' + '='.repeat(50));
  if (mongoOk && pgOk) {
    console.log('✅ Setup completed successfully!');
    console.log('   You can now run: cd backend && node scripts/seed.js');
  } else {
    console.log('⚠️  Setup completed with some issues.');
    if (!mongoOk) {
      console.log('   MongoDB setup failed - check connection');
    }
    if (!pgOk) {
      console.log('   PostgreSQL setup failed - check credentials in backend/.env');
    }
  }
  console.log('='.repeat(50));
  
  process.exit(mongoOk && pgOk ? 0 : 1);
}

main();

