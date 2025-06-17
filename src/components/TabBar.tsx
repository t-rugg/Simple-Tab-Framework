import React, { useState } from 'react';
import { Tab } from './Tab';

interface TabBarProps {
    tabs: Array<{ id: string; title: string; emoji: string }>;
    activeTabId: string | null;
    onTabSelect: (id: string) => void;
    onTabClose: (id: string) => void;
    onTabMove: (sourceGroupId: string, dragIndex: number, targetGroupId: string, hoverIndex: number) => void;
    onTabSplit: (id: string) => void;
    groupId: string;
    totalTabCount: number;
    onAddTab: (e: React.MouseEvent) => void;
    setViewRatio: (ratio: number) => void;
    showEmojis: boolean;
    removingTabId: string | null;
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTabId,
    onTabSelect,
    onTabClose,
    onTabMove,
    onTabSplit,
    groupId,
    totalTabCount,
    onAddTab,
    setViewRatio,
    showEmojis,
    removingTabId
}) => {
    const [, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    return (
        <div 
            className="tab-bar"
            onContextMenu={handleContextMenu}
            style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1
            }}
        >
            {tabs.map((tab, index) => (
                <Tab
                    key={tab.id}
                    id={tab.id}
                    title={tab.title}
                    isActive={tab.id === activeTabId}
                    onSelect={() => onTabSelect(tab.id)}
                    onClose={() => onTabClose(tab.id)}
                    onMove={onTabMove}
                    onSplit={() => onTabSplit(tab.id)}
                    index={index}
                    showEmoji={showEmojis}
                    emoji={tab.emoji}
                    groupId={groupId}
                    totalTabCount={totalTabCount}
                    setViewRatio={setViewRatio}
                    isRemoving={tab.id === removingTabId}
                />
            ))}
            <button 
                className="add-tab-button" 
                onClick={onAddTab}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    color: 'var(--textSecondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                +
            </button>
        </div>
    );
}; 