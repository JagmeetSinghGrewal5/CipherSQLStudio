/**
 * Output Validator
 * Validates query results against expected output
 */

/**
 * Compare two values (handles different types)
 */
function compareValues(actual, expected) {
  // Handle null values
  if (actual === null && expected === null) return true;
  if (actual === null || expected === null) return false;
  
  // Handle numeric comparisons (string numbers vs numbers)
  const actualNum = parseFloat(actual);
  const expectedNum = parseFloat(expected);
  
  if (!isNaN(actualNum) && !isNaN(expectedNum)) {
    return Math.abs(actualNum - expectedNum) < 0.01; // Allow small floating point differences
  }
  
  // Handle strings (case-insensitive comparison)
  if (typeof actual === 'string' && typeof expected === 'string') {
    return actual.trim().toLowerCase() === expected.trim().toLowerCase();
  }
  
  // Strict equality for other types
  return actual === expected;
}

/**
 * Compare two arrays (order-independent for sets)
 */
function compareArrays(actual, expected, orderMatters = false) {
  if (actual.length !== expected.length) return false;
  
  if (orderMatters) {
    return actual.every((val, idx) => compareValues(val, expected[idx]));
  } else {
    // Order-independent comparison
    const actualSorted = [...actual].sort();
    const expectedSorted = [...expected].sort();
    return actualSorted.every((val, idx) => compareValues(val, expectedSorted[idx]));
  }
}

/**
 * Compare two objects
 */
function compareObjects(actual, expected) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();
  
  if (actualKeys.length !== expectedKeys.length) return false;
  
  return actualKeys.every(key => {
    if (!expectedKeys.includes(key)) return false;
    return compareValues(actual[key], expected[key]);
  });
}

/**
 * Validate query result against expected output
 * @param {Array} queryResult - Rows from PostgreSQL query
 * @param {Object} expectedOutput - Expected output definition from MongoDB
 * @returns {Object} - { isValid: boolean, message: string }
 */
function validateOutput(queryResult, expectedOutput) {
  if (!expectedOutput || !expectedOutput.type) {
    return { isValid: true, message: 'No expected output defined' };
  }
  
  const { type, value } = expectedOutput;
  
  try {
    switch (type) {
      case 'table': {
        // Expected: Array of objects
        if (!Array.isArray(value)) {
          return { isValid: false, message: 'Expected output type "table" requires an array' };
        }
        
        if (queryResult.length !== value.length) {
          return {
            isValid: false,
            message: `Expected ${value.length} rows, but got ${queryResult.length} rows`
          };
        }
        
        // Compare each row (order-independent by default)
        const expectedRows = [...value];
        const actualRows = [...queryResult];
        
        // Try to match rows (allowing for order differences)
        let matchedCount = 0;
        for (const expectedRow of expectedRows) {
          const matchIndex = actualRows.findIndex(actualRow => 
            compareObjects(actualRow, expectedRow)
          );
          if (matchIndex !== -1) {
            actualRows.splice(matchIndex, 1);
            matchedCount++;
          }
        }
        
        if (matchedCount !== value.length) {
          return {
            isValid: false,
            message: 'Query result does not match expected output. Check your data and column names.'
          };
        }
        
        return { isValid: true, message: 'Query result matches expected output!' };
      }
      
      case 'single_value': {
        // Expected: Single value (number, string, etc.)
        if (queryResult.length === 0) {
          return { isValid: false, message: 'Query returned no results' };
        }
        
        if (queryResult.length > 1) {
          return { isValid: false, message: 'Query returned multiple rows, expected a single value' };
        }
        
        const firstRow = queryResult[0];
        const firstValue = Object.values(firstRow)[0];
        
        if (!compareValues(firstValue, value)) {
          return {
            isValid: false,
            message: `Expected ${value}, but got ${firstValue}`
          };
        }
        
        return { isValid: true, message: 'Query result matches expected output!' };
      }
      
      case 'column': {
        // Expected: Array of values (single column)
        if (!Array.isArray(value)) {
          return { isValid: false, message: 'Expected output type "column" requires an array' };
        }
        
        if (queryResult.length === 0) {
          return { isValid: false, message: 'Query returned no results' };
        }
        
        // Extract first column from results
        const firstColumnName = Object.keys(queryResult[0])[0];
        const actualColumn = queryResult.map(row => row[firstColumnName]);
        
        if (!compareArrays(actualColumn, value, false)) {
          return {
            isValid: false,
            message: 'Query result column does not match expected values'
          };
        }
        
        return { isValid: true, message: 'Query result matches expected output!' };
      }
      
      case 'count': {
        // Expected: Number (row count)
        const expectedCount = typeof value === 'number' ? value : parseInt(value);
        const actualCount = queryResult.length;
        
        if (actualCount !== expectedCount) {
          return {
            isValid: false,
            message: `Expected ${expectedCount} rows, but got ${actualCount} rows`
          };
        }
        
        return { isValid: true, message: 'Query result matches expected output!' };
      }
      
      case 'row': {
        // Expected: Single object (one row)
        if (queryResult.length === 0) {
          return { isValid: false, message: 'Query returned no results' };
        }
        
        if (queryResult.length > 1) {
          return { isValid: false, message: 'Query returned multiple rows, expected a single row' };
        }
        
        if (!compareObjects(queryResult[0], value)) {
          return {
            isValid: false,
            message: 'Query result does not match expected row'
          };
        }
        
        return { isValid: true, message: 'Query result matches expected output!' };
      }
      
      default:
        return { isValid: true, message: `Unknown expected output type: ${type}` };
    }
  } catch (error) {
    return {
      isValid: false,
      message: `Validation error: ${error.message}`
    };
  }
}

module.exports = {
  validateOutput,
  compareValues,
  compareArrays,
  compareObjects
};

