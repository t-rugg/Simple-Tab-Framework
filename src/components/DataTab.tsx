import React, { useState, useEffect } from 'react';
import './TabContent.css';

interface DataTabProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const DataTab: React.FC<DataTabProps> = ({ 
  title,
  onTitleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleSubmit = () => {
    if (editValue.trim()) {
      onTitleChange(editValue);
    } else {
      setEditValue(title); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleClick = () => {
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
            onChange={handleChange}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h1 onClick={handleClick}>{title}</h1>
        )}
      </div>
      <div className="content-box">
        <p>
          This is a data tab. You can customize its content and functionality as needed.<br/>
          Clicking the header text allows for changing the name of the tab.
        </p>
      </div>
    </div>
  );
}; 