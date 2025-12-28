# Data-Flow Diagram Instructions

## COMPULSORY: Hand-Drawn Data-Flow Diagram

**Title:** "User Clicks Execute Query - Complete Data Flow"

### Step-by-Step Flow to Draw:

```
1. USER INTERACTION
   [User clicks "Execute Query" button]
   ↓

2. FRONTEND STATE UPDATE
   [React setState: loading = true]
   ↓

3. API CALL PREPARATION
   [Prepare request: { query, assignmentId }]
   ↓

4. HTTP REQUEST
   [POST /api/queries/execute]
   ↓

5. BACKEND VALIDATION
   [Express middleware validates SQL query]
   ↓

6. DATABASE CONNECTION
   [Get PostgreSQL connection from pool]
   ↓

7. SCHEMA SETUP
   [Set search path to assignment schema]
   ↓

8. QUERY EXECUTION
   [Execute SQL query in PostgreSQL]
   ↓

9. RESULT VALIDATION
   [Compare results with expected output]
   ↓

10. PROGRESS TRACKING
    [Save attempt to MongoDB]
    ↓

11. RESPONSE PREPARATION
    [Format response with results & validation]
    ↓

12. HTTP RESPONSE
    [Send JSON response to frontend]
    ↓

13. FRONTEND STATE UPDATE
    [Update React state with results]
    ↓

14. UI RENDERING
    [Display results in ResultsPanel component]
```

### Components to Include in Your Drawing:

**Frontend Components:**
- AssignmentAttempt.js (main component)
- Monaco Editor (query input)
- Execute Button
- ResultsPanel (results display)
- React State Management

**Backend Components:**
- Express Router (/api/queries/execute)
- SQL Validation Middleware
- PostgreSQL Connection Pool
- Schema Manager
- Output Validator
- MongoDB Connection

**Databases:**
- PostgreSQL (SQL Sandbox)
- MongoDB (User Progress & Attempts)

**Data Flow Arrows:**
- User Input → Frontend
- Frontend → Backend API
- Backend → PostgreSQL
- Backend → MongoDB
- Backend → Frontend
- Frontend → UI Update

### Labels for Each Step:
1. "User clicks Execute Query button"
2. "React sets loading state to true"
3. "Prepare API request with query and assignmentId"
4. "HTTP POST to /api/queries/execute"
5. "Express validates SQL syntax and security"
6. "Get PostgreSQL connection from pool"
7. "Set search path to assignment-specific schema"
8. "Execute user's SQL query in PostgreSQL"
9. "Validate results against expected output"
10. "Save attempt record to MongoDB"
11. "Format response with results and validation"
12. "Send JSON response back to frontend"
13. "Update React component state with results"
14. "Render results in UI components"

### Drawing Tips:
- Use rectangles for components
- Use circles for databases
- Use arrows to show data flow direction
- Label each arrow with the data being passed
- Include error handling paths
- Show both success and failure flows