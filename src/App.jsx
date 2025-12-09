import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddPoet from './pages/AddPoet';
import AddBook from './pages/AddBook';
import AddPoem from './pages/AddPoem';
import AddVerse from './pages/AddVerse';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-poet" element={<AddPoet />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/add-poem" element={<AddPoem />} />
          <Route path="/add-verse" element={<AddVerse />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
