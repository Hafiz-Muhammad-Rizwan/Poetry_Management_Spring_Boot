import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = authService.getUsername();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Poetry<span className="highlight">Manager</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link>
          <Link to="/add-poet" className={`nav-link ${isActive('/add-poet')}`}>Poets</Link>
          <Link to="/add-book" className={`nav-link ${isActive('/add-book')}`}>Books</Link>
          <Link to="/add-poem" className={`nav-link ${isActive('/add-poem')}`}>Poems</Link>
          <Link to="/add-verse" className={`nav-link ${isActive('/add-verse')}`}>Verses</Link>
          
          {/* User Section */}
          <div className="flex items-center gap-4 ml-6 pl-6 border-l border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="text-white text-sm font-medium">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
