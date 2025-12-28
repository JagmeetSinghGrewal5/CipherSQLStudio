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
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/queries', queryRoutes); // This is where the magic happens
app.use('/api/hints', hintRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attempts', attemptRoutes);

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CipherSQLStudio API is running',
    timestamp: new Date().toISOString()
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

app.listen(PORT, () => {
  console.log(`🚀 CipherSQLStudio server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

