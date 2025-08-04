import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Learn from './pages/Learn';
import TestPanel from './components/TestPanel';

function App() {
  console.log('App component rendering...');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/test" element={<TestPanel />} />
      </Routes>
    </Router>
  );
}

export default App;