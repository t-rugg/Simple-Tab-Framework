import React from 'react';
import './TabContent.css';

interface HomeTabProps {
  title: string;
}

export const HomeTab: React.FC<HomeTabProps> = ({ title }) => {
  return (
    <div className="tab-content-wrapper">
      <h1>{title}</h1>
      <div className="content-box">
        <h2>Getting Started</h2>
        <ul>
          <li>• Right-click on the tab bar to add new tabs</li>
          <li>• Drag tabs to reorder them</li>
          <li>• Drag tabs to the right edge of the screen to create a split view</li>
          <li>• Use the Settings tab to customize your experience</li>
        </ul>
      </div>
    </div>
  );
}; 