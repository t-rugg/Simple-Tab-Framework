import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TabTypeDropdown } from './TabTypeDropdown';
import { SettingsTab } from './SettingsTab';
import { DataTab } from './DataTab';
import { HomeTab } from './HomeTab';
import { AboutTab } from './AboutTab';
import { TabType, getTabTypeConfig } from '../types/tabs';
import { TabBar } from './TabBar';

// temp
const randomEmojis = [
    '🌟', '🎨', '📝', '💡', '🎮',
    '🎵', '📚', '🎯', '🎪', '🎭',
    '🎬', '🎤', '🎧', '🎹', '🎸',
    '🎺', '🎻', '🎼', '📱', '💻',
    '⌨️', '🖥️', '🖨️', '🖱️', '⌚',
    '📷', '🎥', '📹', '🎞️', '📽️',
    '🎟️', '🎫', '🎗️', '🎖️', '🏆',
    '🎲', '🎰', '🎳', '🎱', '🎾',
    '🏀', '⚽', '🏈', '⚾', '🏐',
    '🏉', '🏓', '🏸', '🏒', '🏑',
    '🏏', '🎿', '⛷️', '🏂', '🏋️',
    '🤼', '🤸', '⛹️', '🤾', '🏌️',
    '🏄', '🏊', '🤽', '🚣', '🏇',
    '🚴', '🚵', '🤹'
];

interface TabData {
    id: string;
    title: string;
    emoji: string;
    type: TabType;
}

interface TabGroup {
    id: string;
    tabs: TabData[];
    activeTabId: string;
}

const STORAGE_KEY = 'tab-manager-state';

interface StoredState {
    tabGroups: TabGroup[];
    nextTabId: number;
}

const defaultState: StoredState = {
    tabGroups: [{
        id: '1',
        tabs: [{ 
            id: '1', 
            title: 'Home',
            emoji: '🏠',
            type: 'home'
        }],
        activeTabId: '1'
    }],
    nextTabId: 2
};

const loadStoredState = (): StoredState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return defaultState;
        
        const parsed = JSON.parse(stored);
        if (!parsed.tabGroups || !Array.isArray(parsed.tabGroups) || !parsed.nextTabId) {
            return defaultState;
        }
        return parsed;
    } catch (error) {
        console.error('Failed to load stored state:', error);
        return defaultState;
    }
};

export const TabManager: React.FC = () => {
    const initialState = loadStoredState();
    const [tabGroups, setTabGroups] = useState<TabGroup[]>(initialState.tabGroups);
    const [showEmojis, setShowEmojis] = useState(true);
    const [nextTabId, setNextTabId] = useState(initialState.nextTabId);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [activeGroupId, setActiveGroupId] = useState<string>(tabGroups[0].id);
    const [viewRatio, setViewRatio] = useState(0.5); // 50-50 split by default
    const [removingTabId, setRemovingTabId] = useState<string | null>(null);
    const [newTabId, setNewTabId] = useState<string | null>(null);
    const [maxTabWidth, setMaxTabWidth] = useState(16);
    const isDragging = useRef(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--tabTitleMaxLength', `${maxTabWidth}ch`);
    }, [maxTabWidth]);

    useEffect(() => {
        const handleGlobalContextMenu = (e: MouseEvent) => {
            // Check if the click target is a tab or within a tab
            const target = e.target as HTMLElement;
            const isTab = target.closest('.tab');
            
            if (showDropdown && !isTab) {
                e.preventDefault();
                e.stopPropagation();
                setShowDropdown(false);
            }
        };

        document.addEventListener('contextmenu', handleGlobalContextMenu, true);
        return () => {
            document.removeEventListener('contextmenu', handleGlobalContextMenu, true);
        };
    }, [showDropdown]);

    useEffect(() => {
        const stateToStore: StoredState = {
            tabGroups,
            nextTabId
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }, [tabGroups, nextTabId]);

    const handleAddTabClick = (e: React.MouseEvent, groupId: string) => {
        const position = e.type === 'contextmenu' 
            ? { x: e.clientX, y: e.clientY }
            : {
                x: e.currentTarget.getBoundingClientRect().left,
                y: e.currentTarget.getBoundingClientRect().bottom + 5
            };
        setDropdownPosition(position);
        setActiveGroupId(groupId);
        setShowDropdown(true);
    };

    const addTab = (type: TabType) => {
        const typeConfig = getTabTypeConfig(type);
        const groupIndex = tabGroups.findIndex(g => g.id === activeGroupId);
        
        if (groupIndex === -1) return;

        const group = tabGroups[groupIndex];
        
        // Check if it's a unique tab type that's already open
        if (typeConfig.isUnique) {
            // Find the tab in any group
            const existingTab = tabGroups.flatMap(g => g.tabs).find(tab => tab.type === type);
            if (existingTab) {
                // If it's in the current group, just activate it
                if (group.tabs.find(t => t.id === existingTab.id)) {
                    setTabGroups(prev => {
                        const newGroups = [...prev];
                        newGroups[groupIndex] = {
                            ...group,
                            activeTabId: existingTab.id
                        };
                        return newGroups;
                    });
                } else {
                    // If it's in another group, move it to the current group
                    setTabGroups(prev => {
                        const newGroups = [...prev];
                        // Remove the tab from its current group
                        const sourceGroupIndex = prev.findIndex(g => g.tabs.some(t => t.id === existingTab.id));
                        if (sourceGroupIndex !== -1) {
                            const sourceGroup = { ...prev[sourceGroupIndex] };
                            sourceGroup.tabs = sourceGroup.tabs.filter(t => t.id !== existingTab.id);
                            if (sourceGroup.tabs.length > 0) {
                                sourceGroup.activeTabId = sourceGroup.tabs[0].id;
                            }
                            newGroups[sourceGroupIndex] = sourceGroup;
                        }
                        // Add the tab to the current group
                        newGroups[groupIndex] = {
                            ...group,
                            tabs: [...group.tabs, existingTab],
                            activeTabId: existingTab.id
                        };
                        return newGroups;
                    });
                }
                return;
            }
        }

        // Find the highest tab ID currently in use
        const highestTabId = tabGroups.reduce((max, group) => {
            const groupMax = group.tabs.reduce((groupMax, tab) => {
                const tabId = parseInt(tab.id);
                return isNaN(tabId) ? groupMax : Math.max(groupMax, tabId);
            }, 0);
            return Math.max(max, groupMax);
        }, 0);

        const newId = (highestTabId + 1).toString();

        // For non-unique tabs, find the smallest available number
        let displayName = typeConfig.displayName;
        if (!typeConfig.isUnique) {
            // Get all existing tab titles of this type
            const existingTitles = tabGroups.flatMap(g => g.tabs)
                .filter(tab => tab.type === type)
                .map(tab => tab.title);

            // Find the smallest number that's not used
            let number = 1;
            while (existingTitles.includes(`${typeConfig.displayName} ${number}`)) {
                number++;
            }
            displayName = `${typeConfig.displayName} ${number}`;
        }

        const newTab: TabData = {
            id: newId,
            title: displayName,
            emoji: typeConfig.isUnique ? typeConfig.emoji : randomEmojis[Math.floor(Math.random() * randomEmojis.length)],
            type
        };

        setNewTabId(newId);
        // Clear the newTabId after animation completes
        setTimeout(() => setNewTabId(null), 200);

        setTabGroups(prev => {
            const newGroups = [...prev];
            newGroups[groupIndex] = {
                ...group,
                tabs: [...group.tabs, newTab],
                activeTabId: newId
            };
            return newGroups;
        });
        setNextTabId(highestTabId + 2); // Set next ID to be one more than the highest
    };

    const closeTab = (groupId: string, tabId: string) => {
        // Set the removing tab ID to trigger the animation
        setRemovingTabId(tabId);
        
        // Get the group and tab index
        const group = tabGroups.find(g => g.id === groupId);
        if (!group) return;
        
        const tabIndex = group.tabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;
        
        // Only wait for animation if it's the rightmost tab
        const isRightmost = tabIndex === group.tabs.length - 1;
        const delay = isRightmost ? 200 : 0;
        
        setTimeout(() => {
            setTabGroups(prev => {
                const groupIndex = prev.findIndex(g => g.id === groupId);
                if (groupIndex === -1) return prev;

                const group = prev[groupIndex];
                const newTabs = group.tabs.filter(tab => tab.id !== tabId);
                
                if (newTabs.length === 0) {
                    // If this was the last tab in the group and there's another group, remove this group
                    if (prev.length > 1) {
                        // Reset view ratio to 1 when a view is closed
                        setViewRatio(1);
                        return prev.filter(g => g.id !== groupId);
                    }
                    // If this was the last tab in the last group, just return an empty group
                    return [{
                        id: groupId,
                        tabs: [],
                        activeTabId: ''
                    }];
                }

                // If the closed tab was active, activate the next tab
                let newActiveTabId = group.activeTabId;
                if (newActiveTabId === tabId) {
                    const closedTabIndex = group.tabs.findIndex(tab => tab.id === tabId);
                    const nextTabIndex = closedTabIndex === group.tabs.length - 1 
                        ? closedTabIndex - 1 
                        : closedTabIndex + 1;
                    newActiveTabId = group.tabs[nextTabIndex].id;
                }

                const newGroups = [...prev];
                newGroups[groupIndex] = {
                    ...group,
                    tabs: newTabs,
                    activeTabId: newActiveTabId
                };
                return newGroups;
            });
            setRemovingTabId(null);
        }, delay);
    };

    const moveTab = (sourceGroupId: string, dragIndex: number, targetGroupId: string, hoverIndex: number) => {
        console.log('Moving tab:', { sourceGroupId, dragIndex, targetGroupId, hoverIndex });
        console.log('Current tab groups:', tabGroups);

        // If target group doesn't exist and we're trying to move to group 2, create it
        if (targetGroupId === '2' && !tabGroups.find(g => g.id === '2')) {
            // Set view ratio to 50-50 split when creating new view
            setViewRatio(0.5);
            
            setTabGroups(prev => {
                const sourceGroup = prev.find(g => g.id === sourceGroupId);
                if (!sourceGroup) return prev;

                const tab = sourceGroup.tabs[dragIndex];
                if (!tab) return prev;

                const newGroup: TabGroup = {
                    id: '2',
                    tabs: [tab],
                    activeTabId: tab.id
                };

                const updatedSourceGroup = {
                    ...sourceGroup,
                    tabs: sourceGroup.tabs.filter((_, i) => i !== dragIndex),
                    activeTabId: sourceGroup.tabs[0]?.id || '1'
                };

                return [updatedSourceGroup, newGroup];
            });
            return;
        }

        // Find source and target group indices
        const sourceGroupIndex = tabGroups.findIndex(g => g.id === sourceGroupId);
        const targetGroupIndex = tabGroups.findIndex(g => g.id === targetGroupId);

        if (sourceGroupIndex === -1) {
            console.error('Invalid source group index:', sourceGroupId);
            return;
        }

        if (targetGroupIndex === -1) {
            console.error('Invalid target group index:', targetGroupId);
            return;
        }

        // Create new arrays to avoid mutating state directly
        const newGroups = [...tabGroups];
        const sourceGroup = { ...newGroups[sourceGroupIndex] };
        const targetGroup = { ...newGroups[targetGroupIndex] };

        // Remove tab from source group
        const [movedTab] = sourceGroup.tabs.splice(dragIndex, 1);
        sourceGroup.tabs = [...sourceGroup.tabs];

        // Insert tab into target group
        targetGroup.tabs.splice(hoverIndex, 0, movedTab);
        targetGroup.tabs = [...targetGroup.tabs];
        // Set the moved tab as active in the target group
        targetGroup.activeTabId = movedTab.id;

        // Update active tab in source group to be the tab to the left (or right if no left tab)
        if (sourceGroup.tabs.length > 0) {
            const newActiveIndex = dragIndex > 0 ? dragIndex - 1 : 0;
            sourceGroup.activeTabId = sourceGroup.tabs[newActiveIndex].id;
        }

        // Update the groups
        newGroups[sourceGroupIndex] = sourceGroup;
        newGroups[targetGroupIndex] = targetGroup;

        // Update state
        setTabGroups(newGroups);

        // If source group is now empty, remove it and ensure remaining group has ID "1"
        if (sourceGroup.tabs.length === 0) {
            const remainingGroup = newGroups.find(g => g.id !== sourceGroupId);
            if (remainingGroup) {
                setTabGroups([{
                    ...remainingGroup,
                    id: '1'
                }]);
            }
        }
    };

    const splitView = (groupId: string, tabId: string) => {
        // If we already have two views, don't create a new one
        if (tabGroups.length >= 2) return;

        // Set the view ratio to 50-50 split
        setViewRatio(0.5);

        setTabGroups(prev => {
            const sourceGroupIndex = prev.findIndex(g => g.id === groupId);
            if (sourceGroupIndex === -1) return prev;

            const sourceGroup = prev[sourceGroupIndex];
            const tab = sourceGroup.tabs.find(t => t.id === tabId);
            if (!tab) return prev;

            // Create new group with the dragged tab
            const newGroup: TabGroup = {
                id: groupId === '1' ? '2' : '1', // Use 2 if source is 1, otherwise use 1
                tabs: [tab],
                activeTabId: tab.id
            };

            // Remove the tab from the original group
            const updatedSourceGroup = {
                ...sourceGroup,
                tabs: sourceGroup.tabs.filter(t => t.id !== tabId),
                activeTabId: sourceGroup.tabs[0]?.id || '1'
            };

            // If the source group is now empty, remove it
            if (updatedSourceGroup.tabs.length === 0) {
                return [...prev.filter(g => g.id !== groupId), newGroup];
            }

            // Otherwise, update the source group and add the new group
            const newGroups = [...prev];
            newGroups[sourceGroupIndex] = updatedSourceGroup;
            newGroups.push(newGroup);
            return newGroups;
        });
    };

    const closeAllTabs = (e?: React.MouseEvent) => {
        // If Shift is pressed, skip confirmation
        if (e?.shiftKey) {
            setTabGroups([{
                id: '1',
                tabs: [{ 
                    id: '1', 
                    title: 'Home',
                    emoji: '🏠',
                    type: 'home'
                }],
                activeTabId: '1'
            }]);
            setNextTabId(2);
            return;
        }

        // No confirmation needed here since SettingsTab handles it
        setTabGroups([{
            id: '1',
            tabs: [{ 
                id: '1', 
                title: 'Home',
                emoji: '🏠',
                type: 'home'
            }],
            activeTabId: '1'
        }]);
        setNextTabId(2);
    };

    const renderTabContent = (tab: TabData) => {
        if (tab.type === 'settings') {
            return <SettingsTab
                showEmojis={showEmojis}
                onToggleEmojis={() => setShowEmojis(!showEmojis)}
                onCloseAllTabs={closeAllTabs}
                maxTabWidth={maxTabWidth}
                onMaxTabWidthChange={setMaxTabWidth}
            />;
        }
        if (tab.type === 'data') {
            return <DataTab 
                title={tab.title} 
                onTitleChange={(newTitle: string) => {
                    setTabGroups(prev => {
                        const newGroups = [...prev];
                        const groupIndex = newGroups.findIndex(g => g.tabs.some(t => t.id === tab.id));
                        if (groupIndex === -1) return prev;
                        
                        const tabIndex = newGroups[groupIndex].tabs.findIndex(t => t.id === tab.id);
                        if (tabIndex === -1) return prev;
                        
                        newGroups[groupIndex].tabs[tabIndex] = {
                            ...newGroups[groupIndex].tabs[tabIndex],
                            title: newTitle
                        };
                        return newGroups;
                    });
                }} 
            />;
        }
        if (tab.type === 'home') {
            return <HomeTab title={tab.title} />;
        }
        if (tab.type === 'about') {
            return <AboutTab />;
        }
        return <div>{tab.title}</div>;
    };

    const handleDividerMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            
            const container = document.querySelector('.tab-groups');
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const newRatio = (e.clientX - containerRect.left) / containerRect.width;
            
            // Limit the ratio to prevent views from becoming too small
            if (newRatio > 0.2 && newRatio < 0.8) {
                setViewRatio(newRatio);
            }
        };

        const handleMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="tab-manager">
                <div className="tab-groups">
                    {tabGroups.map((group, groupIndex) => (
                        <div 
                            key={group.id} 
                            className="tab-group"
                            style={{ 
                                flex: tabGroups.length === 1 ? 1 : (groupIndex === 0 ? viewRatio : 1 - viewRatio),
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}
                        >
                            <div 
                                className="tabs-container"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: 0,
                                    backgroundColor: 'var(--bgSecondary)',
                                    borderBottom: '1px solid var(--borderColor)',
                                    overflowX: 'auto',
                                    whiteSpace: 'nowrap'
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    if (showDropdown) {
                                        setShowDropdown(false);
                                    } else {
                                        handleAddTabClick(e, group.id);
                                    }
                                }}
                            >
                                <TabBar
                                    key={group.id}
                                    tabs={group.tabs}
                                    activeTabId={group.activeTabId}
                                    onTabSelect={(tabId) => {
                                        setTabGroups(prev => {
                                            const newGroups = [...prev];
                                            const groupIndex = newGroups.findIndex(g => g.id === group.id);
                                            if (groupIndex !== -1) {
                                                newGroups[groupIndex] = {
                                                    ...newGroups[groupIndex],
                                                    activeTabId: tabId
                                                };
                                            }
                                            return newGroups;
                                        });
                                    }}
                                    onTabClose={(tabId) => closeTab(group.id, tabId)}
                                    onTabMove={moveTab}
                                    onTabSplit={(tabId) => splitView(group.id, tabId)}
                                    groupId={group.id}
                                    totalTabCount={tabGroups.reduce((sum, g) => sum + g.tabs.length, 0)}
                                    onAddTab={(e) => handleAddTabClick(e, group.id)}
                                    setViewRatio={setViewRatio}
                                    showEmojis={showEmojis}
                                    removingTabId={removingTabId}
                                    newTabId={newTabId}
                                />
                            </div>
                            <div className="tab-content">
                                {group.tabs.find(tab => tab.id === group.activeTabId) && 
                                    renderTabContent(group.tabs.find(tab => tab.id === group.activeTabId)!)}
                            </div>
                            {groupIndex < tabGroups.length - 1 && (
                                <div
                                    className="view-divider"
                                    onMouseDown={handleDividerMouseDown}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: '4px',
                                        cursor: 'col-resize',
                                        backgroundColor: 'var(--bgSecondary)',
                                        borderLeft: '1px solid var(--borderColor)',
                                        zIndex: 1
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {showDropdown && (
                    <TabTypeDropdown
                        onSelect={addTab}
                        onClose={() => setShowDropdown(false)}
                        position={dropdownPosition}
                    />
                )}
            </div>
        </DndProvider>
    );
};    