import React from 'react';
import './ResultsPanel.scss';

const ResultsPanel = ({ result, executing }) => {
  if (executing) {
    return (
      <div className="results-panel">
        <h3 className="results-panel__title">Query Results</h3>
        <div className="results-panel__loading">Executing query...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-panel">
        <h3 className="results-panel__title">Query Results</h3>
        <div className="results-panel__empty">
          Execute a query to see results here
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="results-panel">
        <h3 className="results-panel__title">Query Results</h3>
        <div className="results-panel__error">
          <strong>Error:</strong> {result.error}
        </div>
      </div>
    );
  }

  const { rows, rowCount, columns, validation, isCorrect } = result;

  return (
    <div className="results-panel">
      <div className="results-panel__header">
        <h3 className="results-panel__title">Query Results</h3>
        <span className="results-panel__count">
          {rowCount} row{rowCount !== 1 ? 's' : ''}
        </span>
      </div>
      {validation && (
        <div className={`results-panel__validation results-panel__validation--${isCorrect ? 'success' : 'warning'}`}>
          <strong>{isCorrect ? '✓ Correct!' : '✗ Not quite right'}</strong>
          <p>{validation.message}</p>
        </div>
      )}
      {rows && rows.length > 0 ? (
        <div className="results-panel__content">
          <div className="results-panel__table-wrapper">
            <table className="results-panel__table">
              <thead>
                <tr>
                  {columns && columns.length > 0 ? (
                    columns.map((col) => <th key={col}>{col}</th>)
                  ) : (
                    Object.keys(rows[0]).map((col) => <th key={col}>{col}</th>)
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{String(cell ?? 'NULL')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="results-panel__empty">Query executed successfully but returned no rows.</div>
      )}
    </div>
  );
};

export default ResultsPanel;

