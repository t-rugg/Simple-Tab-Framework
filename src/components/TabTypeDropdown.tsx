import React from 'react';
import { TAB_TYPES, TabType } from '../types/tabs';

interface TabTypeDropdownProps {
    onSelect: (type: TabType) => void;
    onClose: () => void;
    position: { x: number; y: number };
}

export const TabTypeDropdown: React.FC<TabTypeDropdownProps> = ({ onSelect, onClose, position }) => {
    return (
        <>
            <div className="dropdown-overlay" onClick={onClose} />
            <div 
                className="tab-type-dropdown"
                style={{ 
                    position: 'absolute',
                    left: position.x,
                    top: position.y
                }}
            >
                {TAB_TYPES.map(type => (
                    <button
                        key={type.type}
                        className="tab-type-option"
                        onClick={() => {
                            onSelect(type.type);
                            onClose();
                        }}
                    >
                        <span className="tab-type-emoji">{type.emoji}</span>
                        <span className="tab-type-name">{type.displayName}</span>
                    </button>
                ))}
            </div>
        </>
    );
}; 