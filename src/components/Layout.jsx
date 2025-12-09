import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="container animate-fade-in">
                {children}
            </main>
            <footer className="footer">
                <p>&copy; 2025 Poetry Management System. Built with React.</p>
            </footer>
        </div>
    );
};

export default Layout;
