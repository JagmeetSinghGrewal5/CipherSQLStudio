// Main App Component - The heart of CipherSQLStudio
// This sets up routing and the overall app structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import AttemptsTracker from './components/AttemptsTracker';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<AssignmentList />} />
              <Route path="/assignment/:id" element={<AssignmentAttempt />} />
              {/* Protected route - only accessible to authenticated users */}
              <Route path="/attempts" element={
                <ProtectedRoute>
                  <AttemptsTracker />
                </ProtectedRoute>
              } />
              {/* TODO: Add 404 page when I have time */}
            </Routes>
          </main>
          <footer className="app__footer">
            <div className="app__footer-content">
              <p>&copy; 2024 CipherSQLStudio. Built with ❤️ for SQL learning.</p>
              <div className="app__footer-links">
                <span>Made by Amandeep Singh</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

