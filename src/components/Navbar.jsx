import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Poetry<span className="highlight">Manager</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link>
          <Link to="/add-poet" className={`nav-link ${isActive('/add-poet')}`}>Add Poet</Link>
          <Link to="/add-book" className={`nav-link ${isActive('/add-book')}`}>Add Book</Link>
          <Link to="/add-poem" className={`nav-link ${isActive('/add-poem')}`}>Add Poem</Link>
          <Link to="/add-verse" className={`nav-link ${isActive('/add-verse')}`}>Add Verse</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
