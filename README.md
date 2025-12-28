# CipherSQLStudio

A modern, interactive SQL learning platform I built to help students practice SQL queries with real-time execution and validation.

## 🚀 About This Project

I created CipherSQLStudio because I wanted to build a hands-on learning platform where students could practice SQL in a real environment, not just theoretical exercises. The platform provides instant feedback and tracks progress, making SQL learning more engaging and effective.

## 💭 Why I Built This

As a developer who's passionate about both education and web development, I wanted to create something that would actually help people learn SQL in a practical way. I remember when I was learning SQL - most tutorials were just theoretical examples that didn't really prepare you for real-world scenarios.

This project started as a weekend experiment but grew into something I'm genuinely proud of. The idea was simple: what if students could practice SQL with real databases and get instant feedback, just like they would in a professional environment?

What makes this different:
- **Real database interactions** - No fake SQLite simulations here, students work with actual PostgreSQL
- **Immediate feedback** - See results instantly, just like using a real database client
- **Progressive difficulty** - I carefully designed the assignments to build on each other
- **Modern UX** - Because learning should be enjoyable, not frustrating

## 🛠️ Technical Decisions & Lessons Learned

I chose this tech stack after trying several alternatives:

**Frontend: React + SCSS**
- Initially considered Vue.js, but React's ecosystem was too good to pass up
- SCSS because I wanted full control over the responsive design
- Monaco Editor was a game-changer - gives that VS Code feel

**Backend: Node.js + Express**
- Considered Python/Django but wanted to keep everything in JavaScript
- Express is simple and gets out of the way

**Databases: PostgreSQL + MongoDB**
- PostgreSQL for the actual SQL sandbox (obviously!)
- MongoDB for storing assignments and user progress (more flexible for this use case)
- Yes, I know it's a bit overkill having two databases, but it works really well

**Challenges I faced:**
- Getting query validation right without being too restrictive
- Making the responsive design work on mobile (CSS Grid was a lifesaver)
- Handling different PostgreSQL data types in validation (DECIMAL vs INTEGER was tricky)

## ✨ Key Features

- **Interactive SQL Editor** - Monaco Editor with syntax highlighting
- **Real-time Query Execution** - Execute SQL against PostgreSQL database
- **Intelligent Validation** - Automatic query result validation
- **Progress Tracking** - Track your learning journey and attempts
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Multiple Difficulty Levels** - Easy, Medium, and Hard SQL challenges
- **Sample Data Viewer** - Explore table schemas and sample data
- **Hint System** - Get intelligent hints when stuck (LLM-powered)

## 🚀 Quick Start

### Prerequisites

Make sure you have these installed:
- Node.js (v14 or higher) - I'm using v18 personally
- PostgreSQL (v12 or higher) - v15+ recommended for best performance
- MongoDB (v4.4 or higher) - Community edition works fine

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ciphersqlstudio.git
   cd ciphersqlstudio
   ```

2. **Install all dependencies at once**
   ```bash
   npm run install-all
   ```
   
   Or install them separately if you prefer:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   
   Copy the example files and update them:
   ```bash
   cp backend/env.example backend/.env
   cp frontend/env.example frontend/.env
   ```
   
   Update `backend/.env` with your database credentials:
   ```env
   PORT=5000
   
   # PostgreSQL Configuration
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=sql_sandbox
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_postgres_password
   
   # MongoDB Configuration  
   MONGODB_URI=mongodb://localhost:27017/ciphersqlstudio
   
   # Optional: LLM Integration for hints
   LLM_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Set up the databases**
   
   Create the PostgreSQL database:
   ```bash
   # Using psql command line
   createdb sql_sandbox
   
   # Or connect to PostgreSQL and run:
   # CREATE DATABASE sql_sandbox;
   ```
   
   Seed both databases with sample data:
   ```bash
   cd backend
   node scripts/seed.js
   ```

5. **Start the development servers**
   ```bash
   # From the root directory - starts both frontend and backend
   npm run dev
   ```
   
   The app will be available at:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

That's it! You should now be able to browse assignments and start practicing SQL.

## 🏗️ Project Structure

```
ciphersqlstudio/
├── backend/                 # Express.js API server
│   ├── config/             # Database configurations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding scripts
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/               # React.js application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── styles/         # SCSS stylesheets
│   │   └── App.js          # Main App component
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🎯 Available SQL Assignments

I've created assignments that progress from basic concepts to advanced topics:

### Easy Level (Perfect for beginners)
- **Basic SELECT queries** - Get comfortable with the fundamentals
- **WHERE clause filtering** - Learn to filter data effectively  
- **COUNT and aggregate functions** - Start working with data summaries
- **Column selection** - Master the art of choosing the right columns
- **Finding maximum values** - Simple but essential operations

### Medium Level (Building confidence)
- **JOIN operations** - Connect data across multiple tables
- **GROUP BY with aggregates** - Summarize data by categories
- **Complex filtering** - Combine multiple conditions like a pro

### Hard Level (For the ambitious)
- **Window functions and ranking** - Advanced analytical queries
- **Recursive queries and CTEs** - Handle hierarchical data
- **Complex subqueries** - Nest queries for powerful results
- **Employee hierarchy analysis** - Real-world business scenarios

Each assignment includes:
- Clear problem description
- Sample data to explore
- Expected output format
- Hints when you get stuck (powered by AI)

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Monaco Editor** - SQL code editor
- **SCSS** - Styling with responsive design
- **Axios** - HTTP client

### Backend
- **Node.js / Express.js** - Server runtime and framework
- **PostgreSQL** - Sandbox database for query execution
- **MongoDB** - Persistence database for assignments and progress
- **OpenAI/Gemini API** - LLM integration for hints (optional)

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:
- Flexible grid layouts that adapt to screen size
- Touch-friendly buttons and interactions
- Readable text sizes on all devices
- Optimized navigation for mobile devices

## 🔒 Security Features

- SQL injection prevention through query validation
- Blocked dangerous SQL keywords (DROP, DELETE, ALTER, etc.)
- Only SELECT queries allowed in sandbox environment
- Query timeout protection (10 seconds)
- Input sanitization and validation

## 🚀 Development Notes

### Running in Development Mode
```bash
npm run dev  # My preferred way - starts everything at once
```

### Building for Production
```bash
cd frontend
npm run build
# The build folder will contain the optimized production files
```

### Database Management
```bash
# Reseed everything (useful during development)
cd backend
node scripts/seed.js

# Only seed MongoDB (if PostgreSQL is already set up)
node scripts/seed-mongodb-only.js
```

### Troubleshooting Common Issues

**"Connection refused" errors:**
- Make sure PostgreSQL and MongoDB are running
- Check your .env file credentials
- Verify database names exist

**Frontend won't start:**
- Delete node_modules and package-lock.json, then `npm install`
- Check if port 3001 is already in use

**Queries not executing:**
- Check browser console for errors
- Verify backend is running on port 5000
- Make sure assignment schemas are created (run seed script)

## 📊 API Endpoints

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get single assignment

### Query Execution
- `POST /api/queries/execute` - Execute SQL query
  ```json
  {
    "query": "SELECT * FROM employees;",
    "assignmentId": "assignment_id_here"
  }
  ```

### Progress Tracking
- `GET /api/attempts/user/:userId` - Get user attempts
- `GET /api/attempts/user/:userId/stats` - Get user statistics

### Hints (Optional)
- `POST /api/hints/generate` - Generate LLM hint
  ```json
  {
    "question": "Assignment question",
    "userQuery": "User's SQL query",
    "errorMessage": "Error message if any"
  }
  ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for SQL learning and education
- Special thanks to the Monaco Editor team for making code editing so smooth
- PostgreSQL and MongoDB communities for their excellent documentation
- React.js community for the amazing ecosystem and helpful tutorials
- My coffee maker for keeping me caffeinated during late-night coding sessions ☕

## 📈 Future Plans

Things I'm thinking about adding:
- [ ] User authentication and profiles
- [ ] More advanced SQL topics (stored procedures, triggers)
- [ ] Team/classroom features for educators
- [ ] Query performance analysis
- [ ] More database engines (MySQL, SQLite)
- [ ] Dark mode (because everyone loves dark mode)

---

**Happy SQL Learning!** 🎉

*If you find this helpful, give it a star ⭐ - it really motivates me to keep improving it!*

