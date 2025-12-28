import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AssignmentList.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// This is the main page where students can browse all SQL assignments
// I spent way too much time getting the responsive design right lol
const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // could probably use an enum here but whatever
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/assignments`);
      setAssignments(response.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      // TODO: maybe add retry logic here? for now just show error
      setError('Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentClick = (id) => {
    navigate(`/assignment/${id}`);
  };

  // probably not the most elegant way to handle difficulty but it works
  const getDifficultyClass = (assignment) => {
    const difficulty = assignment.difficulty || assignment.description || 'Medium';
    return difficulty.toLowerCase();
  };

  const getDifficultyIcon = (difficulty) => {
    const diff = (difficulty || 'medium').toLowerCase();
    // using emojis because why not, makes it more fun
    switch (diff) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🟡'; // fallback to medium
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    const difficulty = (assignment.difficulty || assignment.description || 'medium').toLowerCase();
    return difficulty === filter;
  });

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list">
        <div className="error">
          <h3>⚠️ Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchAssignments} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <header className="hero">
        <div className="hero-logo">
          <div className="hero-logo-icon">
            <span className="logo-c">C</span>
            <span className="logo-semicolon">;</span>
          </div>
        </div>
        <h1>SQL Learning Hub</h1>
        <p>Master SQL through hands-on practice with real-time feedback</p>
        {/* I wanted to keep this simple but informative */}
      </header>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({assignments.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'easy' ? 'active' : ''}`}
          onClick={() => setFilter('easy')}
        >
          🟢 Easy ({assignments.filter(a => (a.difficulty || a.description || '').toLowerCase() === 'easy').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
          onClick={() => setFilter('medium')}
        >
          🟡 Medium ({assignments.filter(a => (a.difficulty || a.description || '').toLowerCase() === 'medium').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'hard' ? 'active' : ''}`}
          onClick={() => setFilter('hard')}
        >
          🔴 Hard ({assignments.filter(a => (a.difficulty || a.description || '').toLowerCase() === 'hard').length})
        </button>
      </div>

      <div className="assignments-grid">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <h3>🎯 No assignments found</h3>
            <p>
              {filter === 'all' 
                ? "No assignments are available at the moment."
                : `No ${filter} difficulty assignments found.`
              }
            </p>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')} className="btn btn-primary">
                Show All
              </button>
            )}
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment._id}
              className={`assignment-card ${getDifficultyClass(assignment)}`}
              onClick={() => handleAssignmentClick(assignment._id)}
            >
              <div className="card-header">
                <h3>{assignment.title}</h3>
                <span className="difficulty-badge">
                  {getDifficultyIcon(assignment.difficulty || assignment.description)}
                  {assignment.difficulty || assignment.description || 'Medium'}
                </span>
              </div>
              
              <p className="description">
                {assignment.question || 'Practice your SQL skills with this challenge.'}
              </p>

              <div className="card-footer">
                <span className="meta">
                  📊 {assignment.sampleTables?.length || assignment.sampleData?.length || 1} table(s)
                </span>
                <span className="action">Start →</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cta">
        <div className="cta-card">
          <h3>Ready to practice SQL?</h3>
          <p>Start with any assignment and track your progress!</p>
          <Link to="/attempts" className="btn btn-secondary">
            View My Progress
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;