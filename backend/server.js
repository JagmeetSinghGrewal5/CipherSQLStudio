// CipherSQLStudio Backend Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup - allow frontend to connect
app.use(cors({
  origin: [
    'http://localhost:3001', // Local development
    'https://cipher-sql-studio-lovat.vercel.app', // Your frontend URL
  ],
  credentials: true
}));

app.use(express.json());

// Import routes
const assignmentRoutes = require('./routes/assignments');
const queryRoutes = require('./routes/queries');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const attemptRoutes = require('./routes/attempts');

// API Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attempts', attemptRoutes);

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

// Start server locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

