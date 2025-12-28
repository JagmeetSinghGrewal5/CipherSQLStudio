import React, { useState } from 'react';
import './SampleDataViewer.scss';

const SampleDataViewer = ({ sampleData }) => {
  const [activeTable, setActiveTable] = useState(null);

  if (!sampleData || !Array.isArray(sampleData) || sampleData.length === 0) {
    return (
      <div className="sample-data-viewer">
        <h3 className="sample-data-viewer__title">Sample Data</h3>
        <p className="sample-data-viewer__empty">No sample data available for this assignment.</p>
      </div>
    );
  }

  const handleTableClick = (tableName) => {
    setActiveTable(activeTable === tableName ? null : tableName);
  };

  return (
    <div className="sample-data-viewer">
      <h3 className="sample-data-viewer__title">Sample Data</h3>
      <div className="sample-data-viewer__tables">
        {sampleData.map((table, index) => (
          <div key={index} className="sample-data-viewer__table">
            <button
              className="sample-data-viewer__table-header"
              onClick={() => handleTableClick(table.tableName)}
            >
              <span className="sample-data-viewer__table-name">{table.tableName}</span>
              <span className="sample-data-viewer__table-toggle">
                {activeTable === table.tableName ? '−' : '+'}
              </span>
            </button>
            {activeTable === table.tableName && (
              <div className="sample-data-viewer__table-content">
                {table.schema && (
                  <div className="sample-data-viewer__schema">
                    <h4>Schema:</h4>
                    <pre>{table.schema}</pre>
                  </div>
                )}
                {(table.rows || table.data) && (table.rows || table.data).length > 0 && (
                  <div className="sample-data-viewer__data">
                    <h4>Sample Rows:</h4>
                    {table.columns && (
                      <div className="sample-data-viewer__columns">
                        <h5>Columns:</h5>
                        <ul>
                          {table.columns.map((col, idx) => (
                            <li key={idx}>
                              <strong>{col.columnName}</strong> ({col.dataType})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="sample-data-viewer__table-wrapper">
                      <table className="sample-data-viewer__data-table">
                        <thead>
                          <tr>
                            {Object.keys((table.rows || table.data)[0]).map((col) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(table.rows || table.data).slice(0, 5).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex}>{String(cell ?? 'NULL')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {(table.rows || table.data).length > 5 && (
                      <p className="sample-data-viewer__note">
                        Showing 5 of {(table.rows || table.data).length} rows
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleDataViewer;

