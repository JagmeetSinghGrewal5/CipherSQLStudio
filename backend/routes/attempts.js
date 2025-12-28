const express = require('express');
const router = express.Router();
const { getMongoDB } = require('../config/database');

// Get all attempts for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getMongoDB();
    
    // Get attempts with assignment details
    const attempts = await db.collection('attempts').aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: 'assignments',
          localField: 'assignmentId',
          foreignField: '_id',
          as: 'assignment'
        }
      },
      {
        $unwind: {
          path: '$assignment',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          assignmentId: 1,
          assignmentTitle: { $ifNull: ['$assignment.title', 'Unknown Assignment'] },
          difficulty: { $ifNull: ['$assignment.difficulty', '$assignment.description'] },
          query: 1,
          isCorrect: 1,
          validationMessage: 1,
          executionTime: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// Get attempts for a specific assignment by a user
router.get('/user/:userId/assignment/:assignmentId', async (req, res) => {
  try {
    const { userId, assignmentId } = req.params;
    const db = getMongoDB();
    const { ObjectId } = require('mongodb');
    
    const attempts = await db.collection('attempts').find({
      userId: userId,
      assignmentId: new ObjectId(assignmentId)
    }).sort({ createdAt: -1 }).toArray();

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching assignment attempts:', error);
    res.status(500).json({ error: 'Failed to fetch assignment attempts' });
  }
});

// Get user statistics
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getMongoDB();
    
    const stats = await db.collection('attempts').aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] }
          },
          uniqueAssignments: { $addToSet: '$assignmentId' },
          avgExecutionTime: { $avg: '$executionTime' }
        }
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          correctAttempts: 1,
          incorrectAttempts: { $subtract: ['$totalAttempts', '$correctAttempts'] },
          uniqueAssignments: { $size: '$uniqueAssignments' },
          successRate: {
            $multiply: [
              { $divide: ['$correctAttempts', '$totalAttempts'] },
              100
            ]
          },
          avgExecutionTime: { $round: ['$avgExecutionTime', 2] }
        }
      }
    ]).toArray();

    const result = stats.length > 0 ? stats[0] : {
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      uniqueAssignments: 0,
      successRate: 0,
      avgExecutionTime: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Save a new attempt
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      assignmentId,
      query,
      isCorrect,
      validationMessage,
      executionTime,
      resultRows
    } = req.body;

    if (!userId || !assignmentId || !query) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getMongoDB();
    const { ObjectId } = require('mongodb');

    const attempt = {
      userId: userId,
      assignmentId: new ObjectId(assignmentId),
      query: query.trim(),
      isCorrect: Boolean(isCorrect),
      validationMessage: validationMessage || null,
      executionTime: executionTime || null,
      resultRows: resultRows || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('attempts').insertOne(attempt);
    
    res.status(201).json({
      success: true,
      attemptId: result.insertedId,
      message: 'Attempt saved successfully'
    });
  } catch (error) {
    console.error('Error saving attempt:', error);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// Delete an attempt
router.delete('/:attemptId', async (req, res) => {
  try {
    const { attemptId } = req.params;
    const db = getMongoDB();
    const { ObjectId } = require('mongodb');

    const result = await db.collection('attempts').deleteOne({
      _id: new ObjectId(attemptId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    res.json({ success: true, message: 'Attempt deleted successfully' });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    res.status(500).json({ error: 'Failed to delete attempt' });
  }
});

// Get leaderboard (top performers)
router.get('/leaderboard', async (req, res) => {
  try {
    const db = getMongoDB();
    
    const leaderboard = await db.collection('attempts').aggregate([
      {
        $group: {
          _id: '$userId',
          totalAttempts: { $sum: 1 },
          correctAttempts: {
            $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] }
          },
          uniqueAssignments: { $addToSet: '$assignmentId' },
          avgExecutionTime: { $avg: '$executionTime' }
        }
      },
      {
        $project: {
          userId: '$_id',
          _id: 0,
          totalAttempts: 1,
          correctAttempts: 1,
          uniqueAssignments: { $size: '$uniqueAssignments' },
          successRate: {
            $multiply: [
              { $divide: ['$correctAttempts', '$totalAttempts'] },
              100
            ]
          },
          avgExecutionTime: { $round: ['$avgExecutionTime', 2] }
        }
      },
      { $sort: { successRate: -1, correctAttempts: -1 } },
      { $limit: 10 }
    ]).toArray();

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;