import React, { useState } from 'react';
import './SettingsTab.css';
import '../themes.css';
import { useTheme } from '../context/ThemeContext';

interface SettingsTabProps {
  showEmojis: boolean;
  onToggleEmojis: () => void;
  onCloseAllTabs: (e?: React.MouseEvent) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  showEmojis, 
  onToggleEmojis,
  onCloseAllTabs 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { themeName } = useTheme();

  return (
    <div className="settings-tab" data-theme={themeName}>
      <h1>Settings</h1>
      <div className="settings-container">
        <h2>Tab Settings</h2>
        <div className="settings-group">
          <button
            className="toggle-button"
            onClick={onToggleEmojis}
          >
            {showEmojis ? 'Hide Emojis' : 'Show Emojis'}
          </button>
        </div>
        <div className="settings-group">
          <button
            className="danger-button"
            onClick={() => setShowConfirmation(true)}
          >
            Close All Tabs
          </button>
        </div>
        {showConfirmation && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <p>
                Are you sure you want to close all tabs? This can't be undone!
              </p>
              <div className="confirm-dialog-buttons">
                <button 
                  className="danger-button"
                  onClick={() => {
                    onCloseAllTabs();
                    setShowConfirmation(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="toggle-button"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 