import React, { useEffect } from 'react';

interface TabDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onCloseTab: () => void;
    onChangeView: () => void;
    position: { x: number; y: number };
    showChangeView: boolean;
}

export const TabDropdown: React.FC<TabDropdownProps> = ({
    isOpen,
    onClose,
    onCloseTab,
    onChangeView,
    position,
    showChangeView
}) => {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if (isOpen) {
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('contextmenu', handleContextMenu, true);
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu, true);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="dropdown-overlay" onClick={onClose} />
            <div 
                className="tab-dropdown"
                style={{ 
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    backgroundColor: 'var(--bgPrimary)',
                    border: '1px solid var(--borderColor)',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    minWidth: '150px'
                }}
            >
                {showChangeView && (
                    <button
                        className="tab-dropdown-option"
                        onClick={() => {
                            onChangeView();
                            onClose();
                        }}
                        style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 16px',
                            border: 'none',
                            background: 'none',
                            color: 'var(--textPrimary)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bgHover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bgPrimary)';
                        }}
                    >
                        Change View
                    </button>
                )}
                <button
                    className="tab-dropdown-option"
                    onClick={() => {
                        onCloseTab();
                        onClose();
                    }}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '8px 16px',
                        border: 'none',
                        background: 'none',
                        color: 'var(--textPrimary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bgHover)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bgPrimary)';
                    }}
                >
                    Close Tab
                </button>
            </div>
        </>
    );
}; 