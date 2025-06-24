import React, { useState } from 'react';
import { Tab } from '@/ui/Tab';
import { TabInstance } from '@/types/index';
import { RibbonType } from '@/styles/index';
import './TabBar.css';

interface TabBarProps {
  tabs: TabInstance[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabMove: (
    sourceGroupId: string,
    dragIndex: number,
    targetGroupId: string,
    hoverIndex: number
  ) => void;
  onTabSplit: (id: string) => void;
  groupId: string;
  totalTabCount: number;
  onAddTab: (e: React.MouseEvent) => void;
  setViewRatio: (ratio: number) => void;
  showEmojis: boolean;
  removingTabId: string | null;
  newTabId: string | null;
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
  removingTabId,
  newTabId,
}) => {
  const [, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="tab-bar" onContextMenu={handleContextMenu}>
      {tabs.map((tabInstance, index) => {
        const { id, tabComponent, props = {} } = tabInstance;
        const title =
          props.title || tabComponent.getTitle?.(props) || 'Unknown';
        const emoji = props.emoji || '❓';
        const ribbon = props.ribbon || 'none';

        return (
          <Tab
            key={id}
            id={id}
            title={title}
            isActive={id === activeTabId}
            onSelect={() => onTabSelect(id)}
            onClose={() => onTabClose(id)}
            onMove={onTabMove}
            onSplit={() => onTabSplit(id)}
            index={index}
            showEmoji={showEmojis}
            emoji={emoji}
            groupId={groupId}
            totalTabCount={totalTabCount}
            setViewRatio={setViewRatio}
            isRemoving={id === removingTabId}
            isRightmost={index === tabs.length - 1}
            isNew={id === newTabId}
            ribbon={ribbon as RibbonType}
          />
        );
      })}
      <button className="add-tab-button" onClick={onAddTab}>
        +
      </button>
    </div>
  );
};
