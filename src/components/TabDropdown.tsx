import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './TabDropdown.css';

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
    const { t } = useTranslation();

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (isOpen) {
                if (e.type === 'contextmenu') {
                    e.preventDefault();
                    e.stopPropagation();
                }
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('contextmenu', handleOutsideClick, true);
            document.addEventListener('click', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('contextmenu', handleOutsideClick, true);
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="tab-dropdown"
            style={{ 
                left: position.x,
                top: position.y
            }}
        >
            {showChangeView && (
                <button
                    className="tab-dropdown-option"
                    onClick={() => {
                        onChangeView();
                        onClose();
                    }}
                >
                    {t('dropdown.changeView')}
                </button>
            )}
            <button
                className="tab-dropdown-option"
                onClick={() => {
                    onCloseTab();
                    onClose();
                }}
            >
                {t('dropdown.closeTab')}
            </button>
        </div>
    );
}; 