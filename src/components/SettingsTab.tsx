import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsTab.css';
import '../themes.css';
import { useTheme } from '../context/ThemeContext';
import { TabFactory, TabComponentProps, Tab } from '../types/tabs';

interface SettingsTabProps extends TabComponentProps {
  showEmojis: boolean;
  onToggleEmojis: () => void;
  onCloseAllTabs: (e?: React.MouseEvent) => void;
  maxTabWidth: number;
  onMaxTabWidthChange: (width: number) => void;
  ribbonWidth: number;
  onRibbonWidthChange: (width: number) => void;
}

export class SettingsTabFactory implements TabFactory {
    getRequiredCallbacks(): string[] {
        return ['onToggleEmojis', 'onCloseAllTabs', 'onMaxTabWidthChange', 'onRibbonWidthChange', 'showEmojis', 'maxTabWidth', 'ribbonWidth'];
    }

    createTabProps({ 
        title, 
        showEmojis,
        onToggleEmojis,
        onCloseAllTabs,
        maxTabWidth,
        onMaxTabWidthChange,
        ribbonWidth,
        onRibbonWidthChange
    }: { 
        id: string; 
        title: string;
        emoji?: string;
        showEmojis?: boolean;
        onToggleEmojis?: () => void;
        onCloseAllTabs?: (e?: React.MouseEvent) => void;
        maxTabWidth?: number;
        onMaxTabWidthChange?: (width: number) => void;
        ribbonWidth?: number;
        onRibbonWidthChange?: (width: number) => void;
    }) {
        return {
            title,
            emoji: '⚙️',
            type: 'settings',
            showEmojis,
            onToggleEmojis,
            onCloseAllTabs,
            maxTabWidth,
            onMaxTabWidthChange,
            ribbonWidth,
            onRibbonWidthChange
        };
    }
}

export const SettingsTab: React.FC<SettingsTabProps> & Tab = ({ 
  showEmojis, 
  onToggleEmojis,
  onCloseAllTabs,
  maxTabWidth,
  onMaxTabWidthChange,
  ribbonWidth,
  onRibbonWidthChange
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showImportConfirmation, setShowImportConfirmation] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [importData, setImportData] = useState<{ [key: string]: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeName } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Ensure language is set to English if not explicitly set to French
    if (i18n.language !== 'fr') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

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

  const handleExportData = () => {
    const data: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tab-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setImportData(data);
        setShowImportConfirmation(true);
      } catch (error) {
        console.error('Failed to parse import file:', error);
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    if (!importData) return;

    try {
      localStorage.clear();
      
      Object.entries(importData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      window.location.reload();
    } catch (error) {
      console.error('Failed to import data:', error);
      alert(t('settings.importError'));
    }
  };

  const handleClearData = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert(t('settings.clearError'));
    }
  };

  return (
    <div className="settings-tab" data-theme={themeName}>
      <h1>{t('settings.title')}</h1>
      <div className="settings-container">
        <div className="settings-group">
          <h2>{t('settings.language')}</h2>
          <div className="language-buttons">
            <button
              className={`language-button ${i18n.language?.startsWith('en') ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`language-button ${i18n.language?.startsWith('fr') ? 'active' : ''}`}
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
        <div className="settings-group">
          <h2>{t('settings.manageData')}</h2>
          <div className="button-group">
            <button
              className="toggle-button"
              onClick={handleExportData}
            >
              {t('settings.exportData')}
            </button>
            <button
              className="toggle-button"
              onClick={handleImportClick}
            >
              {t('settings.importData')}
            </button>
            <button
              className="danger-button"
              onClick={() => setShowClearConfirmation(true)}
            >
              {t('settings.clearData')}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>
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
        {showImportConfirmation && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <p>{t('settings.confirmImport.message')}</p>
              <div className="confirm-dialog-buttons">
                <button 
                  className="danger-button"
                  onClick={handleImportConfirm}
                >
                  {t('settings.confirmImport.yes')}
                </button>
                <button
                  className="toggle-button"
                  onClick={() => {
                    setShowImportConfirmation(false);
                    setImportData(null);
                  }}
                >
                  {t('settings.confirmImport.no')}
                </button>
              </div>
            </div>
          </div>
        )}
        {showClearConfirmation && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <p>{t('settings.confirmClear.message')}</p>
              <div className="confirm-dialog-buttons">
                <button 
                  className="danger-button"
                  onClick={() => {
                    handleClearData();
                    setShowClearConfirmation(false);
                  }}
                >
                  {t('settings.confirmClear.yes')}
                </button>
                <button
                  className="toggle-button"
                  onClick={() => setShowClearConfirmation(false)}
                >
                  {t('settings.confirmClear.no')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Implement the Tab interface methods
SettingsTab.getTitle = () => 'Settings';
SettingsTab.getType = () => 'settings';
SettingsTab.render = (props?: any) => <SettingsTab {...props} />;

// Add static factory property to the component
SettingsTab.factory = new SettingsTabFactory(); 