import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TabContent.css';
import { RibbonType, isValidHexColor } from '../styles/RibbonStyles';

interface DataTabProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  ribbon?: RibbonType;
  ribbonColor?: string;
  onRibbonChange: (color: RibbonType) => void;
}

export const DataTab: React.FC<DataTabProps> = ({ 
  title,
  onTitleChange,
  ribbon = 'none',
  ribbonColor = '#000000',
  onRibbonChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const { t } = useTranslation();
  const [colorInput, setColorInput] = useState(ribbonColor);
  const [isRibbonVisible, setIsRibbonVisible] = useState(ribbon !== 'none');

  useEffect(() => {
    if (ribbon !== 'none') {
      setColorInput(ribbon);
      setIsRibbonVisible(true);
    } else {
      setColorInput(ribbonColor);
      setIsRibbonVisible(false);
    }
  }, [ribbon, ribbonColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColorInput(newColor);
    if (isValidHexColor(newColor) && isRibbonVisible) {
      onRibbonChange(newColor);
    }
  };

  const handleRibbonToggle = () => {
    const newVisibility = !isRibbonVisible;
    setIsRibbonVisible(newVisibility);
    onRibbonChange(newVisibility ? colorInput : 'none');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (editValue.trim()) {
      onTitleChange(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="tab-content-wrapper data-tab">
      <div className="header-container">
        {isEditing ? (
          <input
            type="text"
            className="editable-header"
            value={editValue}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        ) : (
          <h1 onClick={handleTitleClick}>{title}</h1>
        )}
      </div>
      <div className="content-box">
        <p>
          {t('data.description')}<br/>
          {t('data.editHint')}
        </p>
      </div>
      <div className="ribbon-controls">
        <div className="ribbon-control-group">
          <button
            className="toggle-button"
            onClick={handleRibbonToggle}
          >
            {isRibbonVisible ? 'Hide Ribbon' : 'Show Ribbon'}
          </button>
          <label className="color-picker-wrapper">
            <input
              type="color"
              value={colorInput}
              onChange={handleColorChange}
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        </div>
      </div>
    </div>
  );
}; 