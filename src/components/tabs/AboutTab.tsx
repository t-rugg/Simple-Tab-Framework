import React from 'react';
import { useTranslation } from 'react-i18next';
import '../TabContent.css';
import { TabFactory, TabComponentProps, Tab } from '../../types/tabs';

export class AboutTabFactory implements TabFactory {
  getRequiredCallbacks(): string[] {
    return [];
  }

  createTabProps({ title }: { id: string; title: string }) {
    return {
      title,
      emoji: 'ℹ️',
      type: 'about',
    };
  }
}

export const AboutTab: React.FC<TabComponentProps> & Tab = () => {
  const { t } = useTranslation();

  return (
    <div className="tab-content-wrapper">
      <div className="header-container">
        <h1>{t('about.title')}</h1>
      </div>
      <div className="content-box">
        <h2>{t('about.information')}</h2>
        <ul>
          <li>
            <a href="https://github.com/t-rugg/Simple-Tab-Framework">
              {t('about.githubRepo')}
            </a>
          </li>
          <li>{t('about.createdBy')}</li>
        </ul>
      </div>
    </div>
  );
};

// Implement the Tab interface methods
AboutTab.getTitle = () => 'About';
AboutTab.getType = () => 'about';
AboutTab.render = (props?: any) => <AboutTab {...props} />;

// Add static factory property to the component
AboutTab.factory = new AboutTabFactory();
