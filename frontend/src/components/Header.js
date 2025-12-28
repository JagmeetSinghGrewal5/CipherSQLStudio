import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.scss';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <span className="logo-c">C</span>
            <span className="logo-semicolon">;</span>
          </div>
          <div className="logo-text">
            <h1>CipherSQLStudio</h1>
            <p>Learn SQL Interactively</p>
          </div>
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            📚 Assignments
          </Link>
          <Link 
            to="/attempts" 
            className={`nav-link ${isActive('/attempts') ? 'active' : ''}`}
          >
            📊 Progress
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                👤 {user?.name || user?.email}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

