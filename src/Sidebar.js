// src/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar, faCogs } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
        </li>
        <li>
          <Link to="/systems-overview">
            <FontAwesomeIcon icon={faChartBar} /> Systems Overview
          </Link>
        </li>
        <li>
          <Link to="/batch-status">
            <FontAwesomeIcon icon={faCogs} /> Batch Status
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
