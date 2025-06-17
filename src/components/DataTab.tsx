import React from 'react';

interface DataTabProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const DataTab: React.FC<DataTabProps> = ({ 
  title,
  onTitleChange
}) => {
  return (
    <div className="data-tab">
      <div style={{ padding: '20px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '1.1em',
            border: '1px solid var(--borderColor)',
            borderRadius: '4px',
            backgroundColor: 'var(--bgPrimary)',
            color: 'var(--textPrimary)',
            marginBottom: '20px'
          }}
        />
      </div>
    </div>
  );
}; 