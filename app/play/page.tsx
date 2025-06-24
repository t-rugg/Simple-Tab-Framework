'use client';

import { useState, useRef } from 'react';
import { TabManager } from '@/components/TabManager';
import { ThemeToggle } from '@/ui/ThemeToggle';
import '@/components/TabManager.css';
import '../App.css';
import './loading.css';
import './play.css';

export default function PlayPage() {
  const [isTabManagerReady, setIsTabManagerReady] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const callbackReceivedRef = useRef(false);

  const handleTabManagerReady = () => {
    console.log('PlayPage: TabManager ready callback received!');

    // Prevent multiple calls
    if (callbackReceivedRef.current) {
      console.log('PlayPage: Callback already received, ignoring...');
      return;
    }

    callbackReceivedRef.current = true;

    // First hide the loading screen
    setIsTabManagerReady(true);

    // Then show the TabManager after a brief delay to ensure smooth transition
    setTimeout(() => {
      setShowTabManager(true);
    }, 150);
  };

  return (
    <div className="play-page">
      <div className="header">
        <ThemeToggle />
      </div>

      {/* Show loading screen while TabManager is not ready */}
      {!isTabManagerReady && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <div className="loading-text">Loading tabs...</div>
          </div>
        </div>
      )}

      {/* TabManager - rendered when ready, fills entire viewport */}
      {showTabManager && (
        <TabManager onReady={handleTabManagerReady} />
      )}

      {/* Hidden TabManager for initialization */}
      {!showTabManager && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <TabManager onReady={handleTabManagerReady} />
        </div>
      )}
    </div>
  );
}
