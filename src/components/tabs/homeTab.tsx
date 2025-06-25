import React from 'react';
import { useTranslation } from 'react-i18next';
import '@/ui/tabContent.css';
import { TabFactory, TabComponentProps, Tab } from '@/types/index';

export class HomeTabFactory implements TabFactory {
  getRequiredCallbacks(): string[] {
    return ['setTabNotification', 'clearAllNotifications', 'setNotificationByType'];
  }

  createTabProps({ title, setTabNotification, clearAllNotifications, setNotificationByType }: {
    id: string;
    title: string;
    setTabNotification?: (tabId: string, hasNotification: boolean) => void;
    clearAllNotifications?: () => void;
    setNotificationByType?: (tabType: string, hasNotification: boolean) => boolean;
  }) {
    return {
      title,
      emoji: '🏠',
      type: 'home',
      setTabNotification,
      clearAllNotifications,
      setNotificationByType,
    };
  }
}

export const HomeTab: React.FC<TabComponentProps> & Tab = ({
  clearAllNotifications,
  setNotificationByType
}: TabComponentProps & {
  setTabNotification?: (tabId: string, hasNotification: boolean) => void;
  clearAllNotifications?: () => void;
  setNotificationByType?: (tabType: string, hasNotification: boolean) => boolean;
  tabId?: string;
}) => {
  const { t } = useTranslation();

  const handleSetNotification = () => {
    // Set notification on the About tab
    const success = setNotificationByType?.('about', true);

    if (success === false) {
      // The About tab is currently active, so notification wasn't set
      console.log('About tab is currently active - notification not set');
      // You could show a toast or alert here if you want user feedback
    }
  };

  const handleClearNotification = () => {
    // Clear notification from the About tab
    setNotificationByType?.('about', false);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications?.();
  };

  return (
    <div className="tab-content-wrapper">
      <div className="header-container">
        <h1>{t('home.title')}</h1>
      </div>
      <div className="content-box">
        <h2>{t('home.gettingStarted')}</h2>
        <ul>
          <li>• {t('home.instructions.addTabs')}</li>
          <li>• {t('home.instructions.reorderTabs')}</li>
          <li>• {t('home.instructions.splitView')}</li>
          <li>• {t('home.instructions.customize')}</li>
        </ul>
      </div>

      {/* Notification Test Section */}
      <div className="content-box">
        <h2>Notification Test</h2>
        <p>Test the notification dot feature on tabs:</p>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
          Note: Notifications won&apos;t be set on tabs that are currently active.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={handleSetNotification}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Set Notification on About Tab
          </button>
          <button
            onClick={handleClearNotification}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Notification on About Tab
          </button>
          <button
            onClick={handleClearAllNotifications}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

// Implement the Tab interface methods
HomeTab.getTitle = () => 'Home';
HomeTab.getType = () => 'home';
HomeTab.render = (props?: any) => <HomeTab {...props} />;

// Add static factory property to the component
HomeTab.factory = new HomeTabFactory();
