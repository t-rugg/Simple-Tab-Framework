import React from 'react';
import { useTranslation } from 'react-i18next';
import './TabContent.css';
import { TabFactory, TabComponentProps, Tab } from '../types/tabs';

export class HomeTabFactory implements TabFactory {
    getRequiredCallbacks(): string[] {
        return [];
    }

    createTabProps({ title }: { id: string; title: string }) {
        return {
            title,
            emoji: '🏠',
            type: 'home'
        };
    }
}

export const HomeTab: React.FC<TabComponentProps> & Tab = () => {
  const { t } = useTranslation();

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
    </div>
  );
};

// Implement the Tab interface methods
HomeTab.getTitle = () => 'Home';
HomeTab.getType = () => 'home';
HomeTab.render = (props?: any) => <HomeTab {...props} />;

// Add static factory property to the component
HomeTab.factory = new HomeTabFactory(); 