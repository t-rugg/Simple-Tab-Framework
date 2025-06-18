import React from 'react';
import { useTranslation } from 'react-i18next';
import './TabContent.css';

interface HomeTabProps {
  title: string;
}

export const HomeTab: React.FC<HomeTabProps> = ({ title }) => {
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