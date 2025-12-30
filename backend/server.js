// CipherSQLStudio Backend Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup - allow frontend to connect
const allowedOrigins = [
  'http://localhost:3001', // Local development
  'http://localhost:3000', // Alternative local port
  'https://cipher-sql-studio-jade.vercel.app', // Production frontend
  'https://cipher-sql-studio-lovat.vercel.app', // Alternative frontend URL
  'https://cipher-sql-studio-frontend.vercel.app', // Alternative frontend URL
  process.env.FRONTEND_URL, // Environment variable override
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Allow any vercel.app subdomain for development
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Import routes
const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/queries');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const attemptRoutes = require('./routes/attempts');
const hintRoutes = require('./routes/hints');

// API Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/hints', hintRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CipherSQLStudio API Server',
    status: 'running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint for production
app.get('/api/debug', async (req, res) => {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      FRONTEND_URL: process.env.FRONTEND_URL || 'Not set'
    };
    
    // Test MongoDB connection
    let mongoStatus = 'Not tested';
    try {
      const { getMongoDB } = require('./config/database');
      const db = await getMongoDB();
      const collections = await db.listCollections().toArray();
      mongoStatus = `Connected - ${collections.length} collections`;
    } catch (error) {
      mongoStatus = `Failed: ${error.message}`;
    }
    
    res.json({
      environment: envCheck,
      mongodb: mongoStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});

// Start server locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

