const { getPostgreSQL } = require('../config/database');

/**
 * PostgreSQL Schema Manager
 * Handles schema isolation for assignments
 */

/**
 * Generate a safe schema name from assignment ID
 * @param {string} assignmentId - MongoDB ObjectId
 * @returns {string} - Safe schema name (workspace_assignmentId)
 */
function generateSchemaName(assignmentId) {
  // Remove any special characters and create a safe identifier
  const safeId = assignmentId.toString().replace(/[^a-zA-Z0-9]/g, '');
  return `workspace_${safeId}`;
}

/**
 * Create a schema for an assignment if it doesn't exist
 * @param {string} assignmentId - MongoDB ObjectId
 * @returns {Promise<string>} - Schema name
 */
async function createSchemaForAssignment(assignmentId) {
  const schemaName = generateSchemaName(assignmentId);
  const pgPool = getPostgreSQL();
  
  try {
    // Check if schema exists
    const checkResult = await pgPool.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [schemaName]
    );
    
    if (checkResult.rows.length === 0) {
      // Create schema
      await pgPool.query(`CREATE SCHEMA ${schemaName}`);
      console.log(`Created schema: ${schemaName}`);
    }
    
    return schemaName;
  } catch (error) {
    console.error(`Error creating schema ${schemaName}:`, error);
    throw error;
  }
}

/**
 * Drop a schema (for cleanup/reset)
 * @param {string} assignmentId - MongoDB ObjectId
 */
async function dropSchemaForAssignment(assignmentId) {
  const schemaName = generateSchemaName(assignmentId);
  const pgPool = getPostgreSQL();
  
  try {
    await pgPool.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
    console.log(`Dropped schema: ${schemaName}`);
  } catch (error) {
    console.error(`Error dropping schema ${schemaName}:`, error);
    throw error;
  }
}

/**
 * Set search_path for a client connection to use a specific schema
 * @param {object} client - PostgreSQL client
 * @param {string} schemaName - Schema name
 */
async function setSearchPath(client, schemaName) {
  await client.query(`SET search_path TO ${schemaName}`);
}

/**
 * Create tables in a schema based on sampleTables data
 * @param {string} schemaName - Schema name
 * @param {Array} sampleTables - Array of table definitions from MongoDB
 */
async function createTablesInSchema(schemaName, sampleTables) {
  const pgPool = getPostgreSQL();
  const client = await pgPool.connect();
  
  try {
    // Set search path to the schema
    await setSearchPath(client, schemaName);
    
    for (const tableDef of sampleTables) {
      const { tableName, columns, rows } = tableDef;
      
      // Build CREATE TABLE statement
      const columnDefinitions = columns.map(col => {
        const dataType = mapDataType(col.dataType);
        return `${col.columnName} ${dataType}`;
      });
      
      // Add primary key if id column exists
      const hasIdColumn = columns.some(col => col.columnName.toLowerCase() === 'id');
      if (hasIdColumn) {
        const idColumn = columns.find(col => col.columnName.toLowerCase() === 'id');
        columnDefinitions.push(`PRIMARY KEY (${idColumn.columnName})`);
      }
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          ${columnDefinitions.join(',\n          ')}
        );
      `;
      
      // Drop table if exists (for reset)
      await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
      
      // Create table
      await client.query(createTableSQL);
      
      // Insert sample data
      if (rows && rows.length > 0) {
        for (const row of rows) {
          const columnNames = Object.keys(row).join(', ');
          const values = Object.values(row).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            return val;
          }).join(', ');
          
          await client.query(`INSERT INTO ${tableName} (${columnNames}) VALUES (${values})`);
        }
      }
      
      console.log(`Created table ${schemaName}.${tableName} with ${rows?.length || 0} rows`);
    }
  } finally {
    client.release();
  }
}

/**
 * Map MongoDB data types to PostgreSQL data types
 * @param {string} dataType - Data type from MongoDB
 * @returns {string} - PostgreSQL data type
 */
function mapDataType(dataType) {
  const typeMap = {
    'INTEGER': 'INTEGER',
    'INT': 'INTEGER',
    'TEXT': 'TEXT',
    'VARCHAR': 'VARCHAR(255)',
    'STRING': 'VARCHAR(255)',
    'REAL': 'REAL',
    'DECIMAL': 'DECIMAL(10, 2)',
    'NUMERIC': 'NUMERIC(10, 2)',
    'DATE': 'DATE',
    'TIMESTAMP': 'TIMESTAMP',
    'BOOLEAN': 'BOOLEAN',
    'BOOL': 'BOOLEAN'
  };
  
  return typeMap[dataType.toUpperCase()] || 'TEXT';
}

/**
 * Initialize schema and tables for an assignment
 * @param {string} assignmentId - MongoDB ObjectId
 * @param {Array} sampleTables - Array of table definitions
 */
async function initializeAssignmentSchema(assignmentId, sampleTables) {
  const schemaName = await createSchemaForAssignment(assignmentId);
  await createTablesInSchema(schemaName, sampleTables);
  return schemaName;
}

module.exports = {
  generateSchemaName,
  createSchemaForAssignment,
  dropSchemaForAssignment,
  setSearchPath,
  createTablesInSchema,
  initializeAssignmentSchema
};

