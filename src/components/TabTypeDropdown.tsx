import React from 'react';
import { useTranslation } from 'react-i18next';
import { TAB_TYPES, TabType } from '../types/tabs';

interface TabTypeDropdownProps {
    onSelect: (type: TabType) => void;
    onClose: () => void;
    position: { x: number; y: number };
}

export const TabTypeDropdown: React.FC<TabTypeDropdownProps> = ({ onSelect, onClose, position }) => {
    const { t } = useTranslation();

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
                {TAB_TYPES.map((type, index) => (
                    <React.Fragment key={type.type}>
                        <button
                            className="tab-type-option"
                            onClick={() => {
                                onSelect(type.type);
                                onClose();
                            }}
                        >
                            <span className="tab-type-emoji">{type.emoji}</span>
                            <span className="tab-type-name">{t(`tabs.${type.type}`)}</span>
                        </button>
                        {type.addDividerAfter && index < TAB_TYPES.length - 1 && (
                            <div 
                                style={{
                                    height: '1px',
                                    backgroundColor: 'var(--borderColor)',
                                    margin: '4px 0'
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}; 