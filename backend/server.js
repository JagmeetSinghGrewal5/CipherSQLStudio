// CipherSQLStudio Backend Server
// Main Express.js server that handles all API requests
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/queries');
const hintRoutes = require('./routes/hints');
const progressRoutes = require('./routes/progress');
const authRoutes = require('./routes/auth');
const attemptRoutes = require('./routes/attempts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
const corsOptions = {
  origin: [
    'http://localhost:3001', // Local development
    'https://cipher-sql-studio-lovat.vercel.app', // Production frontend
    'https://cipher-sql-studio-backend.vercel.app' // Backend (for testing)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Allow cross-origin requests from specified origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/queries', queryRoutes); // This is where the magic happens
app.use('/api/hints', hintRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attempts', attemptRoutes);

// Root route for Vercel
app.get('/', (req, res) => {
  res.json({ 
    message: 'CipherSQLStudio API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      assignments: '/api/assignments',
      auth: '/api/auth',
      queries: '/api/queries',
      progress: '/api/progress',
      attempts: '/api/attempts'
    }
  });
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CipherSQLStudio API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handler - catches any unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server (only in non-serverless environments)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CipherSQLStudio server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel serverless functions
module.exports = app;

