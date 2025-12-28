const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';

async function seedMongoDB() {
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();
    console.log('Connected to MongoDB');

    // Clear existing data
    await db.collection('assignments').deleteMany({});
    console.log('Cleared existing assignments');

    // Sample assignments data
    const assignments = [
      {
        title: 'Basic SELECT Query',
        difficulty: 'Easy',
        topic: 'SELECT Basics',
        description: 'Learn to retrieve data from a single table using SELECT statements.',
        question: 'Write a SQL query to retrieve all columns from the "employees" table.',
        sampleData: [
          {
            tableName: 'employees',
            schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  department VARCHAR(50),
  salary DECIMAL(10, 2)
);`,
            data: [
              { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
            ]
          }
        ],
        initialQuery: 'SELECT * FROM employees;'
      },
      {
        title: 'Filtering with WHERE Clause',
        difficulty: 'Easy',
        topic: 'WHERE Clause',
        description: 'Practice filtering data using WHERE conditions.',
        question: 'Write a SQL query to find all employees in the IT department with a salary greater than 70000.',
        sampleData: [
          {
            tableName: 'employees',
            schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  department VARCHAR(50),
  salary DECIMAL(10, 2)
);`,
            data: [
              { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
            ]
          }
        ],
        initialQuery: ''
      },
      {
        title: 'JOIN Multiple Tables',
        difficulty: 'Medium',
        topic: 'JOINs',
        description: 'Learn to combine data from multiple tables using JOIN operations.',
        question: 'Write a SQL query to retrieve employee names along with their department names. Use a JOIN between employees and departments tables.',
        sampleData: [
          {
            tableName: 'employees',
            schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  department_id INT
);`,
            data: [
              { id: 1, first_name: 'John', last_name: 'Doe', department_id: 1 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', department_id: 2 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', department_id: 1 },
            ]
          },
          {
            tableName: 'departments',
            schema: `CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  location VARCHAR(100)
);`,
            data: [
              { id: 1, name: 'IT', location: 'Building A' },
              { id: 2, name: 'HR', location: 'Building B' },
              { id: 3, name: 'Finance', location: 'Building C' },
            ]
          }
        ],
        initialQuery: ''
      },
      {
        title: 'Aggregate Functions',
        difficulty: 'Medium',
        topic: 'Aggregation',
        description: 'Practice using aggregate functions like COUNT, SUM, AVG, MAX, MIN.',
        question: 'Write a SQL query to find the average salary for each department. Group the results by department.',
        sampleData: [
          {
            tableName: 'employees',
            schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  department VARCHAR(50),
  salary DECIMAL(10, 2)
);`,
            data: [
              { id: 1, first_name: 'John', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', department: 'IT', salary: 80000 },
              { id: 4, first_name: 'Alice', department: 'HR', salary: 70000 },
            ]
          }
        ],
        initialQuery: ''
      },
      {
        title: 'Complex Subquery',
        difficulty: 'Hard',
        topic: 'Subqueries',
        description: 'Master nested queries and subqueries for complex data retrieval.',
        question: 'Write a SQL query to find employees whose salary is greater than the average salary of all employees.',
        sampleData: [
          {
            tableName: 'employees',
            schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  salary DECIMAL(10, 2)
);`,
            data: [
              { id: 1, first_name: 'John', last_name: 'Doe', salary: 75000 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', salary: 65000 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', salary: 80000 },
              { id: 4, first_name: 'Alice', last_name: 'Williams', salary: 70000 },
            ]
          }
        ],
        initialQuery: ''
      }
    ];

    // Insert assignments into MongoDB
    const result = await db.collection('assignments').insertMany(assignments);
    console.log(`✅ Inserted ${result.insertedCount} assignments into MongoDB`);

    await mongoClient.close();
    console.log('✅ MongoDB seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding MongoDB:', error);
    process.exit(1);
  }
}

seedMongoDB();

