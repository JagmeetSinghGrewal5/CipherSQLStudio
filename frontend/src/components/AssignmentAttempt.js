import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SampleDataViewer from './SampleDataViewer';
import ResultsPanel from './ResultsPanel';
import './AssignmentAttempt.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AssignmentAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/assignments/${id}`);
      setAssignment(response.data);
      setSqlQuery(response.data.initialQuery || '');
      setError(null);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError('Failed to load assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setQueryResult({ success: false, error: 'Please enter a SQL query' });
      return;
    }

    try {
      setExecuting(true);
      setQueryResult(null);
      const response = await axios.post(`${API_BASE_URL}/queries/execute`, {
        query: sqlQuery,
        assignmentId: id
      });
      setQueryResult(response.data);
    } catch (err) {
      setQueryResult({
        success: false,
        error: err.response?.data?.error || err.message || 'Failed to execute query'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoadingHint(true);
      setHint(null);
      const response = await axios.post(`${API_BASE_URL}/hints/generate`, {
        question: assignment.question,
        userQuery: sqlQuery,
        errorMessage: queryResult?.error || null
      });
      setHint(response.data.hint);
    } catch (err) {
      console.error('Error getting hint:', err);
      setHint(err.response?.data?.hint || 'Unable to generate hint at this time.');
    } finally {
      setLoadingHint(false);
    }
  };

  const handleEditorChange = (value) => {
    setSqlQuery(value || '');
  };

  if (loading) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__loading">Loading assignment...</div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__error">
          {error || 'Assignment not found'}
          <button 
            className="assignment-attempt__back-btn"
            onClick={() => navigate('/')}
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-attempt">
      <div className="assignment-attempt__header">
        <button 
          className="assignment-attempt__back-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Assignments
        </button>
        <h2 className="assignment-attempt__title">{assignment.title}</h2>
        <span className={`assignment-attempt__difficulty assignment-attempt__difficulty--${(assignment.difficulty || assignment.description || 'medium').toLowerCase()}`}>
          {assignment.difficulty || assignment.description || 'Medium'}
        </span>
      </div>

      <div className="assignment-attempt__content">
        <div className="assignment-attempt__left-panel">
          <div className="question-panel">
            <h3 className="question-panel__title">Question</h3>
            <div className="question-panel__content">
              <p>{assignment.question}</p>
            </div>
          </div>

          <SampleDataViewer sampleData={assignment.sampleTables || assignment.sampleData} />

          <div className="hint-panel">
            <button
              className="hint-panel__button"
              onClick={handleGetHint}
              disabled={loadingHint}
            >
              {loadingHint ? 'Generating Hint...' : 'Get Hint'}
            </button>
            {hint && (
              <div className="hint-panel__content">
                <strong>Hint:</strong> {hint}
              </div>
            )}
          </div>
        </div>

        <div className="assignment-attempt__right-panel">
          <div className="editor-panel">
            <div className="editor-panel__header">
              <h3 className="editor-panel__title">SQL Editor</h3>
              <button
                className="editor-panel__execute-btn"
                onClick={handleExecuteQuery}
                disabled={executing}
              >
                {executing ? 'Executing...' : 'Execute Query'}
              </button>
            </div>
            <div className="editor-panel__editor">
              <Editor
                height="400px"
                defaultLanguage="sql"
                value={sqlQuery}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          <ResultsPanel result={queryResult} executing={executing} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;

