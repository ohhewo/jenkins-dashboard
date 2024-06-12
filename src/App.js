// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import D3Component from './D3Component';
import CustomCalendarHeatmap from './CustomCalendarHeatmap';
import SystemsOverview from './SystemsOverview';
import BatchStatus from './BatchStatus';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopNavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/systems-overview" element={<SystemsOverview />} />
            <Route path="/batch-status" element={<BatchStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Dashboard = () => (
  <div className="dashboard-container">
    <h1>SYSTEM STATUS</h1>
    <D3Component />
    <h2>Job Success Calendar</h2>
    <CustomCalendarHeatmap />
  </div>
);

export default App;
