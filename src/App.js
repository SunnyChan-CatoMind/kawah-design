import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KwahAIApp from './components/KwahAIApp';
import CustomImageAdjustment from './components/CustomImageAdjustment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KwahAIApp />} />
        <Route path="/custom" element={<CustomImageAdjustment />} />
      </Routes>
    </Router>
  );
}

export default App;

