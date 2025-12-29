// Main query execution endpoint - this is where the magic happens!
// Handles SQL execution, validation, and progress tracking
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getPostgreSQL, getMongoDB } = require('../config/database');
const { setSearchPath, generateSchemaName, createSchemaForAssignment } = require('../utils/schemaManager');
const { validateOutput } = require('../utils/outputValidator');
const { optionalAuth } = require('../middleware/auth');

// Security: Only allow safe SQL operations
// I'm being pretty strict here to prevent any nasty surprises
const ALLOWED_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
  'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT',
  'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL',
  'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'INTERSECT', 'EXCEPT', 'EXISTS'
];

// These are absolutely forbidden - no exceptions!
const BLOCKED_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE',
  'GRANT', 'REVOKE', 'EXEC', 'EXECUTE', 'CALL', 'PROCEDURE', 'FUNCTION'
];

// Basic SQL validation - keeps the bad stuff out
const validateSQL = (query) => {
  const upperQuery = query.toUpperCase();
  
  // Check for dangerous keywords first
  for (const blocked of BLOCKED_KEYWORDS) {
    if (upperQuery.includes(blocked)) {
      return { valid: false, error: `Blocked keyword detected: ${blocked}` };
    }
  }
  
  // Make sure it's a SELECT query (this is a learning platform after all)
  if (!upperQuery.trim().startsWith('SELECT')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }
  
  return { valid: true };
};

// Execute SQL query
router.post('/execute',
  optionalAuth, // Optional auth - works for both authenticated and anonymous users
  [
    body('query').trim().notEmpty().withMessage('Query is required'),
    body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { query, assignmentId } = req.body;
      
      // Get userId - using session-based approach for now
      // TODO: implement proper JWT authentication when we add user accounts
      const userId = req.user ? req.user.id : 'session_user';
      
      // Validate SQL
      const validation = validateSQL(query);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      // Get assignment to check expected output and ensure schema exists
      const db = await getMongoDB(); // Make it async
      const { ObjectId } = require('mongodb');
      const assignment = await db.collection('assignments').findOne({ 
        _id: new ObjectId(assignmentId) 
      });
      
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Ensure schema exists for this assignment
      const schemaName = await createSchemaForAssignment(assignmentId);
      
      const pgPool = getPostgreSQL();
      
      // Execute query with timeout in the assignment's schema
      const client = await pgPool.connect();
      try {
        // Set search path to the assignment's schema
        await setSearchPath(client, schemaName);
        
        const result = await Promise.race([
          client.query(query),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), 10000)
          )
        ]);
        
        // Validate output if expected output is defined
        let validationResult = null;
        if (assignment.expectedOutput) {
          validationResult = validateOutput(result.rows, assignment.expectedOutput);
        }
        
        // Determine if query is correct
        const isCorrect = validationResult ? validationResult.isValid : null;
        
        // Update or create user progress
        // userId is already set from authenticated user or generated session ID
        try {
          const progressCollection = db.collection('userProgress');
          const existingProgress = await progressCollection.findOne({
            userId: userId,
            assignmentId: new ObjectId(assignmentId)
          });
          
          if (existingProgress) {
            await progressCollection.updateOne(
              { _id: existingProgress._id },
              {
                $set: {
                  sqlQuery: query,
                  lastAttempt: new Date(),
                  isCompleted: isCorrect === true,
                  attemptCount: (existingProgress.attemptCount || 0) + 1
                }
              }
            );
          } else {
            await progressCollection.insertOne({
              userId: userId,
              assignmentId: new ObjectId(assignmentId),
              sqlQuery: query,
              lastAttempt: new Date(),
              isCompleted: isCorrect === true,
              attemptCount: 1
            });
          }
        } catch (progressError) {
          console.error('Error updating user progress:', progressError);
          // Don't fail the request if progress update fails
        }
        
        // Save attempt to MongoDB (both old and new format for compatibility)
        const startTime = Date.now();
        try {
          // Save to old format (keep for compatibility)
          await db.collection('query_attempts').insertOne({
            assignmentId: new ObjectId(assignmentId),
            userId: userId,
            query,
            executedAt: new Date(),
            success: true,
            rowCount: result.rows.length,
            isCorrect: isCorrect
          });

          // Save to new attempts format
          await db.collection('attempts').insertOne({
            userId: userId,
            assignmentId: new ObjectId(assignmentId),
            query: query.trim(),
            isCorrect: Boolean(isCorrect),
            validationMessage: validationResult ? validationResult.message : null,
            executionTime: Date.now() - startTime,
            resultRows: result.rows.length,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } catch (mongoError) {
          console.error('Error saving query attempt:', mongoError);
          // Don't fail the request if MongoDB save fails
        }
        
        res.json({
          success: true,
          rows: result.rows,
          rowCount: result.rows.length,
          columns: result.fields ? result.fields.map(f => f.name) : [],
          validation: validationResult,
          isCorrect: isCorrect
        });
      } catch (queryError) {
        // Save failed attempt
        const startTime = Date.now();
        try {
          // Save to old format (keep for compatibility)
          await db.collection('query_attempts').insertOne({
            assignmentId: new ObjectId(assignmentId),
            userId: userId,
            query,
            executedAt: new Date(),
            success: false,
            error: queryError.message
          });

          // Save to new attempts format
          await db.collection('attempts').insertOne({
            userId: userId,
            assignmentId: new ObjectId(assignmentId),
            query: query.trim(),
            isCorrect: false,
            validationMessage: queryError.message,
            executionTime: Date.now() - startTime,
            resultRows: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } catch (mongoError) {
          console.error('Error saving query attempt:', mongoError);
        }
        
        res.status(400).json({
          success: false,
          error: queryError.message
        });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Failed to execute query', message: error.message });
    }
  }
);

module.exports = router;

