import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import HealthReport from './components/HealthReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/health-report" element={<HealthReport />} />
      </Routes>
    </Router>
  );
}

export default App;