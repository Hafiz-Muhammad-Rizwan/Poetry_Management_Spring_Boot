import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddPoet from './pages/AddPoet';
import AddBook from './pages/AddBook';
import AddPoem from './pages/AddPoem';
import AddVerse from './pages/AddVerse';
import { authService } from './services/authService';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          authService.isAuthenticated() ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/signup" element={
          authService.isAuthenticated() ? <Navigate to="/" replace /> : <Signup />
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-poet" element={
          <ProtectedRoute>
            <Layout>
              <AddPoet />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-book" element={
          <ProtectedRoute>
            <Layout>
              <AddBook />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-poem" element={
          <ProtectedRoute>
            <Layout>
              <AddPoem />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/add-verse" element={
          <ProtectedRoute>
            <Layout>
              <AddVerse />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
