const { MongoClient } = require('mongodb');
require('dotenv').config();
const { initializeAssignmentSchema } = require('../utils/schemaManager');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';

async function seedData() {
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();
    console.log('Connected to MongoDB');

    // Clear existing data
    await db.collection('assignments').deleteMany({});
    console.log('Cleared existing assignments');

    // Sample assignments data matching the new schema structure
    const assignments = [
      {
        title: 'Basic SELECT Query',
        description: 'Easy',
        question: 'Write a SQL query to retrieve all columns from the "employees" table.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'last_name', dataType: 'TEXT' },
              { columnName: 'email', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
            { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', department: 'HR', salary: 65000 },
            { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Filtering with WHERE Clause',
        description: 'Easy',
        question: 'Write a SQL query to find all employees in the IT department with a salary greater than 70000.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'last_name', dataType: 'TEXT' },
              { columnName: 'email', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', department: 'IT', salary: 75000 },
            { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', department: 'IT', salary: 80000 },
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'JOIN Multiple Tables',
        description: 'Medium',
        question: 'Write a SQL query to retrieve employee names along with their department names. Use a JOIN between employees and departments tables.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'last_name', dataType: 'TEXT' },
              { columnName: 'department_id', dataType: 'INTEGER' }
            ],
            rows: [
              { id: 1, first_name: 'John', last_name: 'Doe', department_id: 1 },
              { id: 2, first_name: 'Jane', last_name: 'Smith', department_id: 2 },
              { id: 3, first_name: 'Bob', last_name: 'Johnson', department_id: 1 },
            ]
          },
          {
            tableName: 'departments',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'location', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, name: 'IT', location: 'Building A' },
              { id: 2, name: 'HR', location: 'Building B' },
              { id: 3, name: 'Finance', location: 'Building C' },
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { first_name: 'John', last_name: 'Doe', name: 'IT' },
            { first_name: 'Jane', last_name: 'Smith', name: 'HR' },
            { first_name: 'Bob', last_name: 'Johnson', name: 'IT' },
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Aggregate Functions',
        description: 'Medium',
        question: 'Write a SQL query to find the average salary for each department. Group the results by department.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, first_name: 'John', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', department: 'IT', salary: 80000 },
              { id: 4, first_name: 'Alice', department: 'HR', salary: 70000 },
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { department: 'IT', avg: 77500 },
            { department: 'HR', avg: 67500 },
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Count Rows',
        description: 'Easy',
        question: 'Write a SQL query to count the total number of employees in the IT department.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, first_name: 'John', department: 'IT', salary: 75000 },
              { id: 2, first_name: 'Jane', department: 'HR', salary: 65000 },
              { id: 3, first_name: 'Bob', department: 'IT', salary: 80000 },
            ]
          }
        ],
        expectedOutput: {
          type: 'count',
          value: 2
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Find Maximum Salary',
        description: 'Easy',
        question: 'Write a SQL query to find the maximum salary from the employees table.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, first_name: 'John', salary: 75000 },
              { id: 2, first_name: 'Jane', salary: 65000 },
              { id: 3, first_name: 'Bob', salary: 80000 },
            ]
          }
        ],
        expectedOutput: {
          type: 'single_value',
          value: 80000
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Get Employee Names',
        description: 'Easy',
        question: 'Write a SQL query to retrieve only the first_name column from all employees.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'first_name', dataType: 'TEXT' },
              { columnName: 'last_name', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, first_name: 'John', last_name: 'Doe' },
              { id: 2, first_name: 'Jane', last_name: 'Smith' },
              { id: 3, first_name: 'Bob', last_name: 'Johnson' },
            ]
          }
        ],
        expectedOutput: {
          type: 'column',
          value: ['John', 'Jane', 'Bob']
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert assignments into MongoDB one by one to get IDs
    const insertedAssignments = [];
    for (const assignment of assignments) {
      const result = await db.collection('assignments').insertOne(assignment);
      insertedAssignments.push({
        ...assignment,
        _id: result.insertedId
      });
    }
    console.log(`Inserted ${insertedAssignments.length} assignments`);

    // Initialize PostgreSQL schemas and tables for each assignment
    for (const assignment of insertedAssignments) {
      try {
        await initializeAssignmentSchema(assignment._id.toString(), assignment.sampleTables);
        console.log(`Initialized schema for assignment: ${assignment.title}`);
      } catch (error) {
        console.error(`Error initializing schema for assignment ${assignment.title}:`, error);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
