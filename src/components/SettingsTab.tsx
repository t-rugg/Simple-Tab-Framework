import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsTab.css';
import '../themes.css';
import { useTheme } from '../context/ThemeContext';

interface SettingsTabProps {
  showEmojis: boolean;
  onToggleEmojis: () => void;
  onCloseAllTabs: (e?: React.MouseEvent) => void;
  maxTabWidth: number;
  onMaxTabWidthChange: (width: number) => void;
  ribbonWidth: number;
  onRibbonWidthChange: (width: number) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  showEmojis, 
  onToggleEmojis,
  onCloseAllTabs,
  maxTabWidth,
  onMaxTabWidthChange,
  ribbonWidth,
  onRibbonWidthChange
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation();

  const handleMaxWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onMaxTabWidthChange(value);
    }
  };

  const handleRibbonWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onRibbonWidthChange(value);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="settings-tab" data-theme={themeName}>
      <h1>{t('settings.title')}</h1>
      <div className="settings-container">
        <div className="settings-group">
          <h2>{t('settings.language')}</h2>
          <div className="language-buttons">
            <button
              className={`language-button ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`language-button ${i18n.language === 'fr' ? 'active' : ''}`}
              onClick={() => changeLanguage('fr')}
            >
              FR
            </button>
          </div>
        </div>
        <h2>{t('settings.tabSettings')}</h2>
        <div className="settings-group">
          <button
            className="toggle-button"
            onClick={onToggleEmojis}
          >
            {showEmojis ? t('settings.hideEmojis') : t('settings.showEmojis')}
          </button>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <label>{t('settings.maxTabWidth', { width: maxTabWidth })}</label>
            <input
              type="range"
              min="8"
              max="32"
              value={maxTabWidth}
              onChange={handleMaxWidthChange}
              className="range-input"
            />
          </div>
        </div>
        <div className="settings-group">
          <div className="setting-item">
            <label>{t('settings.ribbonWidth', { width: ribbonWidth })}</label>
            <input
              type="range"
              min="0"
              max="12"
              value={ribbonWidth}
              onChange={handleRibbonWidthChange}
              className="range-input"
            />
          </div>
        </div>
        <div className="settings-group">
          <button
            className="danger-button"
            onClick={() => setShowConfirmation(true)}
          >
            {t('settings.closeAllTabs')}
          </button>
        </div>
        {showConfirmation && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <p>{t('settings.confirmCloseAll.message')}</p>
              <div className="confirm-dialog-buttons">
                <button 
                  className="danger-button"
                  onClick={() => {
                    onCloseAllTabs();
                    setShowConfirmation(false);
                  }}
                >
                  {t('settings.confirmCloseAll.yes')}
                </button>
                <button
                  className="toggle-button"
                  onClick={() => setShowConfirmation(false)}
                >
                  {t('settings.confirmCloseAll.no')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 