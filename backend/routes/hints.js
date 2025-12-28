const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const axios = require('axios');

// LLM API configuration
const getLLMConfig = () => {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  if (provider === 'openai') {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
  } else if (provider === 'gemini') {
    return {
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  
  throw new Error('Invalid LLM provider');
};

// Generate hint using LLM
router.post('/generate',
  [
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('userQuery').optional().trim(),
    body('errorMessage').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { question, userQuery, errorMessage } = req.body;
      const config = getLLMConfig();
      const provider = process.env.LLM_PROVIDER || 'openai';

      let prompt;
      if (errorMessage) {
        // Hint for error correction
        prompt = `You are a SQL learning assistant. A student is working on this SQL assignment:

Assignment Question: ${question}

They tried this query:
${userQuery || 'No query provided'}

And got this error:
${errorMessage}

Provide a helpful HINT (not the solution) to guide them toward fixing the error. Focus on:
1. What might be wrong with their approach
2. Concepts they should review
3. A nudge in the right direction

Do NOT provide the complete solution. Keep the hint concise (2-3 sentences).`;
      } else {
        // General hint
        prompt = `You are a SQL learning assistant. A student is working on this SQL assignment:

Assignment Question: ${question}

${userQuery ? `They have written this query so far:\n${userQuery}\n\n` : ''}

Provide a helpful HINT (not the solution) to guide them. Focus on:
1. Key SQL concepts they should consider
2. What tables/columns might be relevant
3. A nudge in the right direction

Do NOT provide the complete solution. Keep the hint concise (2-3 sentences).`;
      }

      let response;
      
      if (provider === 'openai') {
        response = await axios.post(config.url, {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful SQL learning assistant. Provide hints, not solutions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        }, { headers: config.headers });
        
        const hint = response.data.choices[0].message.content;
        res.json({ hint });
      } else if (provider === 'gemini') {
        response = await axios.post(config.url, {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }, { headers: config.headers });
        
        const hint = response.data.candidates[0].content.parts[0].text;
        res.json({ hint });
      } else {
        throw new Error('Unsupported LLM provider');
      }
    } catch (error) {
      console.error('Error generating hint:', error);
      
      // Fallback hint if LLM fails
      const { errorMessage } = req.body;
      const fallbackHint = errorMessage 
        ? "Check your SQL syntax. Review the table names, column names, and ensure all keywords are spelled correctly. Consider the data types of the columns you're working with."
        : "Think about what data you need to retrieve. Consider which tables contain the information and how they might be related. Review SQL concepts like SELECT, WHERE, and JOIN.";
      
      res.status(500).json({ 
        hint: fallbackHint,
        error: 'LLM service unavailable, showing fallback hint'
      });
    }
  }
);

module.exports = router;

