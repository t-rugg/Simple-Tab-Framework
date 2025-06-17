import React from 'react';
import './TabContent.css';

export const AboutTab: React.FC = () => {
  return (
    <div className="tab-content-wrapper">
      <h1>About</h1>
      <div className="content-box">
        <h2>Information</h2>
        <ul>
          <li>
            <a href="https://github.com/t-rugg/Simple-Tab-Framework">
              GitHub Repository
            </a>
          </li>
          <li>Created by Timothy Rugg</li>
        </ul>
      </div>
    </div>
  );
}; 