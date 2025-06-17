import React from 'react';

interface HomeTabProps {
  title: string;
}

export const HomeTab: React.FC<HomeTabProps> = ({ }) => {
  return (
    <div className="home-tab">
      <div style={{ padding: '20px' }}>
        <h1 style={{ 
          fontSize: '2em', 
          marginBottom: '20px',
          color: 'var(--textPrimary)'
        }}>
          Welcome
        </h1>
        <div style={{
          backgroundColor: 'var(--bgSecondary)',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid var(--borderColor)'
        }}>
          <h2 style={{ 
            fontSize: '1.5em', 
            marginBottom: '15px',
            color: 'var(--textPrimary)'
          }}>
            Getting Started
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: 'var(--textSecondary)'
          }}>
            <li style={{ marginBottom: '10px' }}>• Right-click on the tab bar to add new tabs</li>
            <li style={{ marginBottom: '10px' }}>• Drag tabs to reorder them</li>
            <li style={{ marginBottom: '10px' }}>• Drag tabs to the right edge of the screen to create a split view</li>
            <li style={{ marginBottom: '10px' }}>• Use the Settings tab to customize your experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 