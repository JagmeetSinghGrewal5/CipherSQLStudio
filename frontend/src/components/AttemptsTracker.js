import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AttemptsTracker.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Progress tracking component - this was fun to build!
// Shows all user attempts with filtering and sorting options
const AttemptsTracker = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, correct
  const [sortBy, setSortBy] = useState('recent'); // recent, assignment, status
  const { user } = useAuth(); // Get authenticated user

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      // Use authenticated user's ID for personalized progress tracking
      const userId = user?.id || user?._id || 'session_user';
      const response = await axios.get(`${API_BASE_URL}/attempts/user/${userId}`);
      setAttempts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attempts:', err);
      setError('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  // This function handles both filtering and sorting
  // Could probably split this into separate functions but it works fine
  const filteredAndSortedAttempts = () => {
    let filtered = attempts;

    // Apply filter first
    if (filter === 'correct') {
      filtered = attempts.filter(attempt => attempt.isCorrect);
    }

    // Then sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'assignment':
          return a.assignmentTitle.localeCompare(b.assignmentTitle);
        case 'status':
          return b.isCorrect - a.isCorrect; // correct first
        default:
          return 0;
      }
    });
  };

  // Format dates in a readable way
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate long queries so they don't break the layout
  const truncateQuery = (query, maxLength = 100) => {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="attempts-tracker">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your attempts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attempts-tracker">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchAttempts} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const processedAttempts = filteredAndSortedAttempts();

  return (
    <div className="attempts-tracker">
      <div className="header">
        <div className="header-logo">
          <div className="header-logo-icon">
            <span className="logo-c">C</span>
            <span className="logo-semicolon">;</span>
          </div>
        </div>
        <h2>Your SQL Progress</h2>
        <p>Track your learning journey and review past attempts</p>
      </div>

      {/* Filters and Sorting */}
      <div className="controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Attempts</option>
            <option value="correct">Correct Only</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recent">Most Recent</option>
            <option value="assignment">Assignment</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Attempts List */}
      <div className="attempts-list">
        {processedAttempts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-logo">
              <div className="empty-logo-icon">
                <span className="logo-c">C</span>
                <span className="logo-semicolon">;</span>
              </div>
            </div>
            <h3>Start Your SQL Journey!</h3>
            <p>
              {filter === 'all' 
                ? "You haven't attempted any assignments yet. Start practicing to see your progress here!"
                : `No ${filter} attempts found. Try adjusting your filters.`
              }
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Assignments
            </Link>
          </div>
        ) : (
          processedAttempts.map((attempt, index) => (
            <div key={attempt.id || index} className="attempt-card">
              <div className="attempt-header">
                <div className="attempt-info">
                  <h4 className="attempt-title">{attempt.assignmentTitle}</h4>
                  <span className={`difficulty-badge ${(attempt.difficulty || 'medium').toLowerCase()}`}>
                    {attempt.difficulty || 'Medium'}
                  </span>
                </div>
                <div className="attempt-meta">
                  <span className="attempt-date">{formatDate(attempt.createdAt)}</span>
                  <span className={`attempt-status ${attempt.isCorrect ? 'correct' : 'incorrect'}`}>
                    {attempt.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                  </span>
                </div>
              </div>
              
              <div className="attempt-query">
                <h5>Your Query:</h5>
                <code className="query-code">
                  {truncateQuery(attempt.query)}
                </code>
              </div>
              
              {attempt.validationMessage && (
                <div className={`attempt-validation ${attempt.isCorrect ? 'success' : 'error'}`}>
                  <strong>Result:</strong> {attempt.validationMessage}
                </div>
              )}
              
              <div className="attempt-actions">
                <Link 
                  to={`/assignment/${attempt.assignmentId}`}
                  className="btn btn-secondary btn-small"
                >
                  Try Again
                </Link>
                {attempt.executionTime && (
                  <span className="execution-time">
                    ⚡ {attempt.executionTime}ms
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttemptsTracker;