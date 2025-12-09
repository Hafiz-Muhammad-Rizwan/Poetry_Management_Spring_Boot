import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to Poetry Manager</h1>
                <p className="subtitle">Manage your collection of poets, books, poems, and verses with elegance.</p>
                <div className="cta-group">
                    <Link to="/add-poet" className="btn btn-primary">Add New Poet</Link>
                    <Link to="/add-poem" className="btn btn-secondary">Add New Poem</Link>
                </div>
            </div>

            <div className="stats-grid">
                <div className="glass-panel stat-card">
                    <h3>Poets</h3>
                    <p className="stat-number">12</p>
                    <p className="stat-desc">Registered Poets</p>
                </div>
                <div className="glass-panel stat-card">
                    <h3>Books</h3>
                    <p className="stat-number">45</p>
                    <p className="stat-desc">Published Collections</p>
                </div>
                <div className="glass-panel stat-card">
                    <h3>Poems</h3>
                    <p className="stat-number">128</p>
                    <p className="stat-desc">Individual Poems</p>
                </div>
                <div className="glass-panel stat-card">
                    <h3>Verses</h3>
                    <p className="stat-number">1,024</p>
                    <p className="stat-desc">Total Verses</p>
                </div>
            </div>

            <style>{`
        .hero-section {
          text-align: center;
          padding: 4rem 0;
        }
        
        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-card {
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-card h3 {
          color: var(--color-text-secondary);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          color: var(--color-text-primary);
          margin: 0;
          background: var(--color-accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .stat-desc {
          font-size: 0.9rem;
          margin: 0;
        }
      `}</style>
        </div>
    );
};

export default Home;
