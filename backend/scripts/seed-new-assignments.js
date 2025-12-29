const { MongoClient } = require('mongodb');
require('dotenv').config();
const { initializeAssignmentSchema } = require('../utils/schemaManager');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersqlstudio';

async function seedNewAssignments() {
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await db.collection('assignments').deleteMany({});
    console.log('🗑️  Cleared existing assignments');

    // New comprehensive assignments - 2 Easy, 2 Medium, 2 Hard
    const assignments = [
      // EASY ASSIGNMENTS
      {
        title: 'Basic Employee Selection',
        description: 'Easy',
        question: 'Write a SQL query to retrieve all columns from the "employees" table.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000 },
              { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000 },
              { id: 3, name: 'Mike Johnson', department: 'Sales', salary: 55000 },
              { id: 4, name: 'Sarah Wilson', department: 'HR', salary: 60000 }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000 },
            { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000 },
            { id: 3, name: 'Mike Johnson', department: 'Sales', salary: 55000 },
            { id: 4, name: 'Sarah Wilson', department: 'HR', salary: 60000 }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Filter High Salary Employees',
        description: 'Easy',
        question: 'Find all employees who earn more than $60,000. Show their name and salary.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'department', dataType: 'TEXT' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000 },
              { id: 2, name: 'Jane Smith', department: 'Marketing', salary: 65000 },
              { id: 3, name: 'Mike Johnson', department: 'Sales', salary: 55000 },
              { id: 4, name: 'Sarah Wilson', department: 'HR', salary: 60000 }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { name: 'John Doe', salary: 75000 },
            { name: 'Jane Smith', salary: 65000 }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // MEDIUM ASSIGNMENTS
      {
        title: 'Employee Department Analysis',
        description: 'Medium',
        question: 'Join employees with departments table to show employee names with their department details. Include department_name and location.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'department_id', dataType: 'INTEGER' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, name: 'John Doe', department_id: 1, salary: 75000 },
              { id: 2, name: 'Jane Smith', department_id: 2, salary: 65000 },
              { id: 3, name: 'Mike Johnson', department_id: 3, salary: 55000 },
              { id: 4, name: 'Sarah Wilson', department_id: 4, salary: 60000 }
            ]
          },
          {
            tableName: 'departments',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'department_name', dataType: 'TEXT' },
              { columnName: 'location', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, department_name: 'Engineering', location: 'San Francisco' },
              { id: 2, department_name: 'Marketing', location: 'New York' },
              { id: 3, department_name: 'Sales', location: 'Chicago' },
              { id: 4, department_name: 'Human Resources', location: 'Austin' }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { name: 'John Doe', department_name: 'Engineering', location: 'San Francisco' },
            { name: 'Jane Smith', department_name: 'Marketing', location: 'New York' },
            { name: 'Mike Johnson', department_name: 'Sales', location: 'Chicago' },
            { name: 'Sarah Wilson', department_name: 'Human Resources', location: 'Austin' }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Salary Statistics by Department',
        description: 'Medium',
        question: 'Calculate the average salary and employee count for each department. Show department name, average salary (rounded to 2 decimals), and employee count.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'department_id', dataType: 'INTEGER' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, name: 'John Doe', department_id: 1, salary: 75000 },
              { id: 2, name: 'Alice Brown', department_id: 1, salary: 80000 },
              { id: 3, name: 'Jane Smith', department_id: 2, salary: 65000 },
              { id: 4, name: 'Mike Johnson', department_id: 3, salary: 55000 },
              { id: 5, name: 'Tom Davis', department_id: 3, salary: 60000 },
              { id: 6, name: 'Sarah Wilson', department_id: 4, salary: 60000 }
            ]
          },
          {
            tableName: 'departments',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'department_name', dataType: 'TEXT' },
              { columnName: 'location', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, department_name: 'Engineering', location: 'San Francisco' },
              { id: 2, department_name: 'Marketing', location: 'New York' },
              { id: 3, department_name: 'Sales', location: 'Chicago' },
              { id: 4, department_name: 'Human Resources', location: 'Austin' }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { department_name: 'Engineering', avg_salary: 77500.00, employee_count: 2 },
            { department_name: 'Marketing', avg_salary: 65000.00, employee_count: 1 },
            { department_name: 'Sales', avg_salary: 57500.00, employee_count: 2 },
            { department_name: 'Human Resources', avg_salary: 60000.00, employee_count: 1 }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // HARD ASSIGNMENTS
      {
        title: 'Employee Ranking with Window Functions',
        description: 'Hard',
        question: 'Rank employees by salary within each department using window functions. Show employee name, department name, salary, and their rank within the department (highest salary = rank 1).',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'department_id', dataType: 'INTEGER' },
              { columnName: 'salary', dataType: 'DECIMAL' }
            ],
            rows: [
              { id: 1, name: 'John Doe', department_id: 1, salary: 75000 },
              { id: 2, name: 'Alice Brown', department_id: 1, salary: 80000 },
              { id: 3, name: 'Jane Smith', department_id: 2, salary: 65000 },
              { id: 4, name: 'Mike Johnson', department_id: 3, salary: 55000 },
              { id: 5, name: 'Tom Davis', department_id: 3, salary: 60000 },
              { id: 6, name: 'Sarah Wilson', department_id: 4, salary: 60000 }
            ]
          },
          {
            tableName: 'departments',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'department_name', dataType: 'TEXT' },
              { columnName: 'location', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, department_name: 'Engineering', location: 'San Francisco' },
              { id: 2, department_name: 'Marketing', location: 'New York' },
              { id: 3, department_name: 'Sales', location: 'Chicago' },
              { id: 4, department_name: 'Human Resources', location: 'Austin' }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { name: 'Alice Brown', department_name: 'Engineering', salary: 80000, salary_rank: 1 },
            { name: 'John Doe', department_name: 'Engineering', salary: 75000, salary_rank: 2 },
            { name: 'Jane Smith', department_name: 'Marketing', salary: 65000, salary_rank: 1 },
            { name: 'Tom Davis', department_name: 'Sales', salary: 60000, salary_rank: 1 },
            { name: 'Mike Johnson', department_name: 'Sales', salary: 55000, salary_rank: 2 },
            { name: 'Sarah Wilson', department_name: 'Human Resources', salary: 60000, salary_rank: 1 }
          ]
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Recursive Employee Hierarchy',
        description: 'Hard',
        question: 'Find the complete reporting hierarchy starting from CEO. Show employee name, their manager name, and hierarchy level. Use recursive CTE.',
        sampleTables: [
          {
            tableName: 'employees',
            columns: [
              { columnName: 'id', dataType: 'INTEGER' },
              { columnName: 'name', dataType: 'TEXT' },
              { columnName: 'manager_id', dataType: 'INTEGER' },
              { columnName: 'department', dataType: 'TEXT' }
            ],
            rows: [
              { id: 1, name: 'Robert CEO', manager_id: null, department: 'Executive' },
              { id: 2, name: 'John Doe', manager_id: 1, department: 'Engineering' },
              { id: 3, name: 'Jane Smith', manager_id: 1, department: 'Marketing' },
              { id: 4, name: 'Mike Johnson', manager_id: 2, department: 'Engineering' },
              { id: 5, name: 'Sarah Wilson', manager_id: 3, department: 'Marketing' }
            ]
          }
        ],
        expectedOutput: {
          type: 'table',
          value: [
            { employee_name: 'Robert CEO', manager_name: null, hierarchy_level: 1 },
            { employee_name: 'John Doe', manager_name: 'Robert CEO', hierarchy_level: 2 },
            { employee_name: 'Jane Smith', manager_name: 'Robert CEO', hierarchy_level: 2 },
            { employee_name: 'Mike Johnson', manager_name: 'John Doe', hierarchy_level: 3 },
            { employee_name: 'Sarah Wilson', manager_name: 'Jane Smith', hierarchy_level: 3 }
          ]
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
    console.log(`📝 Inserted ${insertedAssignments.length} assignments`);

    // Initialize PostgreSQL schemas and tables for each assignment
    for (const assignment of insertedAssignments) {
      try {
        await initializeAssignmentSchema(assignment._id.toString(), assignment.sampleTables);
        console.log(`✅ Initialized schema for assignment: ${assignment.title}`);
      } catch (error) {
        console.error(`❌ Error initializing schema for assignment ${assignment.title}:`, error);
      }
    }

    console.log('🎉 New assignments seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Easy assignments: 2`);
    console.log(`   Medium assignments: 2`);
    console.log(`   Hard assignments: 2`);
    console.log(`   Total assignments: ${assignments.length}`);
    
    await mongoClient.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoClient.close();
    process.exit(1);
  }
}

seedNewAssignments();