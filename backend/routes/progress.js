const express = require('express');
const router = express.Router();
const { getMongoDB } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get current user's progress for all assignments (requires authentication)
router.get('/', authenticate, async (req, res) => {
  try {
    const db = getMongoDB();
    
    const progress = await db.collection('userProgress')
      .find({ userId: req.user.id })
      .toArray();
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Get current user's progress for a specific assignment (requires authentication)
router.get('/assignment/:assignmentId', authenticate, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const db = getMongoDB();
    const { ObjectId } = require('mongodb');
    
    const progress = await db.collection('userProgress').findOne({
      userId: req.user.id,
      assignmentId: new ObjectId(assignmentId)
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching assignment progress:', error);
    res.status(500).json({ error: 'Failed to fetch assignment progress' });
  }
});

// Get all completed assignments for current user (requires authentication)
router.get('/completed', authenticate, async (req, res) => {
  try {
    const db = getMongoDB();
    
    const completed = await db.collection('userProgress')
      .find({ 
        userId: req.user.id,
        isCompleted: true 
      })
      .toArray();
    
    res.json(completed);
  } catch (error) {
    console.error('Error fetching completed assignments:', error);
    res.status(500).json({ error: 'Failed to fetch completed assignments' });
  }
});

module.exports = router;

