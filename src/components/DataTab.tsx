import React, { useState } from 'react';
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

  return (
    <div className="tab-content-wrapper data-tab">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="editable-header"
        />
      ) : (
        <h1 onClick={() => setIsEditing(true)}>{title}</h1>
      )}
      <div className="content-box">
        <p>
          This is a data tab. You can customize its content and functionality as needed.<br/>
          Clicking the header text allows for changing the name of the tab.
        </p>
      </div>
    </div>
  );
}; 