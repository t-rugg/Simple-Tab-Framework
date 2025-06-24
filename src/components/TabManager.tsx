import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TabTypeDropdown } from './TabTypeDropdown';
import { SettingsTab } from './tabs/SettingsTab';
import { DataTab } from './tabs/DataTab';
import { HomeTab } from './tabs/HomeTab';
import { AboutTab } from './tabs/AboutTab';
import {
  TabType,
  getTabTypeConfig,
  TabInstance,
  TabFactory,
  TabComponent,
} from '../types/tabs';
import { TabBar } from './TabBar';
import './ViewDivider.css';
import './TabManager.css';

interface TabGroup {
  id: string;
  tabs: TabInstance[];
  activeTabId: string;
}

const STORAGE_KEY = 'tab-manager-state';

interface StoredState {
  tabGroups: Array<{
    id: string;
    tabs: Array<{
      id: string;
      type: TabType;
      props: any;
    }>;
    activeTabId: string;
  }>;
  nextTabId: number;
}

// Registry of tab components
const tabComponentRegistry: Record<TabType, TabComponent> = {
  home: HomeTab,
  data: DataTab,
  settings: SettingsTab,
  about: AboutTab,
};

// Dynamically generate factory registry from component registry
const tabFactoryRegistry: Record<TabType, TabFactory> = Object.fromEntries(
  Object.entries(tabComponentRegistry).map(([type, component]) => [
    type as TabType,
    component.factory,
  ])
) as Record<TabType, TabFactory>;

// Use tabFactoryRegistry for default Home tab props
const defaultHomeTabProps = tabFactoryRegistry['home'].createTabProps({
  id: '1',
  title: 'Home',
});

const defaultState = {
  tabGroups: [
    {
      id: '1',
      tabs: [
        {
          id: '1',
          tabComponent: HomeTab,
          props: defaultHomeTabProps,
        },
      ],
      activeTabId: '1',
    },
  ] as TabGroup[],
  nextTabId: 2,
};

const loadStoredState = (): { tabGroups: TabGroup[]; nextTabId: number } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored);
    if (
      !parsed.tabGroups ||
      !Array.isArray(parsed.tabGroups) ||
      !parsed.nextTabId
    ) {
      return defaultState;
    }

    // Reconstruct TabInstance objects from stored data
    const reconstructedTabGroups: TabGroup[] = parsed.tabGroups.map(
      (group: any) => ({
        id: group.id,
        tabs: group.tabs.map((tab: any): TabInstance => {
          const tabComponent = tabComponentRegistry[tab.type as TabType];
          if (!tabComponent) {
            console.warn(
              `Unknown tab type: ${tab.type}, falling back to HomeTab`
            );
            return {
              id: tab.id,
              tabComponent: HomeTab,
              props: { ...tab.props, type: 'home' },
            };
          }
          // Use the factory to reconstruct props, passing all saved props
          const factory = tabComponent.factory;
          const props = factory.createTabProps({
            ...tab.props,
            id: tab.id,
            title: tab.props.title,
          });
          return {
            id: tab.id,
            tabComponent,
            props,
          };
        }),
        activeTabId: group.activeTabId,
      })
    );

    return {
      tabGroups: reconstructedTabGroups,
      nextTabId: parsed.nextTabId,
    };
  } catch (error) {
    console.error('Failed to load stored state:', error);
    return defaultState;
  }
};

export const TabManager: React.FC = () => {
  const initialState = loadStoredState();
  const [tabGroups, setTabGroups] = useState<TabGroup[]>(
    initialState.tabGroups
  );
  const [showEmojis, setShowEmojis] = useState(true);
  const [nextTabId, setNextTabId] = useState(initialState.nextTabId);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [activeGroupId, setActiveGroupId] = useState<string>(tabGroups[0].id);
  const [viewRatio, setViewRatio] = useState(0.5); // 50-50 split by default
  const [removingTabId, setRemovingTabId] = useState<string | null>(null);
  const [newTabId, setNewTabId] = useState<string | null>(null);
  const [maxTabWidth, setMaxTabWidth] = useState(() => {
    const stored = localStorage.getItem('maxTabWidth');
    return stored ? parseInt(stored, 10) : 16;
  });
  const [ribbonWidth, setRibbonWidth] = useState(() => {
    const stored = localStorage.getItem('ribbonWidth');
    return stored ? parseInt(stored, 10) : 4;
  });
  const isDragging = useRef(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--tabTitleMaxLength',
      `${maxTabWidth}ch`
    );
    localStorage.setItem('maxTabWidth', maxTabWidth.toString());
  }, [maxTabWidth]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--ribbonWidth',
      `${ribbonWidth}px`
    );
    localStorage.setItem('ribbonWidth', ribbonWidth.toString());
  }, [ribbonWidth]);

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
      document.removeEventListener(
        'contextmenu',
        handleGlobalContextMenu,
        true
      );
    };
  }, [showDropdown]);

  useEffect(() => {
    // Convert TabInstance objects to serializable format for storage
    const serializableTabGroups = tabGroups.map(group => ({
      id: group.id,
      tabs: group.tabs.map(tab => ({
        id: tab.id,
        type: tab.tabComponent.getType(),
        props: tab.props,
      })),
      activeTabId: group.activeTabId,
    }));

    const stateToStore: StoredState = {
      tabGroups: serializableTabGroups,
      nextTabId,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [tabGroups, nextTabId]);

  // Update tab instances when relevant state changes
  useEffect(() => {
    setTabGroups(prevGroups => {
      return prevGroups.map(group => ({
        ...group,
        tabs: group.tabs.map(tab => {
          const tabType = tab.tabComponent.getType();
          const factory = tabFactoryRegistry[tabType as TabType];

          // Get required callbacks for this factory
          const requiredCallbacks = factory.getRequiredCallbacks?.() || [];
          const callbacks = provideCallbacks(tab.id, requiredCallbacks);

          // Always pass all props, only override id/title/callbacks
          const factoryArgs = {
            ...tab.props,
            id: tab.id,
            title: tab.props.title || tab.tabComponent.getTitle(tab.props),
            ...callbacks,
          };

          // Update props using the factory
          const updatedProps = factory.createTabProps(factoryArgs);

          return {
            ...tab,
            props: {
              ...tab.props,
              ...updatedProps,
            },
          };
        }),
      }));
    });
  }, [showEmojis, maxTabWidth, ribbonWidth]); // Dependencies for settings that affect tab instances

  // Update tab titles when language changes
  useEffect(() => {
    // Only update if translations are available and i18n is initialized
    if (!i18n.isInitialized || !i18n.language) return;

    setTabGroups(prevGroups => {
      return prevGroups.map(group => ({
        ...group,
        tabs: group.tabs.map(tab => {
          const typeConfig = getTabTypeConfig(tab.tabComponent.getType());

          // Only update titles for unique tabs
          if (typeConfig.isUnique) {
            const expectedTitle = t(`tabs.${tab.tabComponent.getType()}`);
            const currentTitle = tab.props?.title;

            // Only update if the translation is valid and different from current
            if (
              expectedTitle &&
              !expectedTitle.startsWith('?') &&
              expectedTitle !== currentTitle
            ) {
              return {
                ...tab,
                props: {
                  ...tab.props,
                  title: expectedTitle,
                },
              };
            }
          }
          // For non-unique tabs, preserve the existing title and all other properties
          return tab;
        }),
      }));
    });
  }, [i18n.language, t, i18n.isInitialized]);

  const handleAddTabClick = (e: React.MouseEvent, groupId: string) => {
    const position =
      e.type === 'contextmenu'
        ? { x: e.clientX, y: e.clientY }
        : {
            x: e.currentTarget.getBoundingClientRect().left,
            y: e.currentTarget.getBoundingClientRect().bottom + 5,
          };
    setDropdownPosition(position);
    setActiveGroupId(groupId);
    setShowDropdown(true);
  };

  // Helper function to provide callbacks based on factory requirements
  const provideCallbacks = (tabId: string, requiredCallbacks: string[]) => {
    const callbacks: any = {};

    if (requiredCallbacks.includes('onTitleChange')) {
      callbacks.onTitleChange = (newTitle: string) => {
        setTabGroups(prev => {
          const newGroups = [...prev];
          const groupIndex = newGroups.findIndex(g =>
            g.tabs.some(t => t.id === tabId)
          );
          if (groupIndex === -1) return prev;
          const tabIndex = newGroups[groupIndex].tabs.findIndex(
            t => t.id === tabId
          );
          if (tabIndex === -1) return prev;
          newGroups[groupIndex].tabs[tabIndex] = {
            ...newGroups[groupIndex].tabs[tabIndex],
            props: {
              ...newGroups[groupIndex].tabs[tabIndex].props,
              title: newTitle,
            },
          };
          return newGroups;
        });
      };
    }

    if (requiredCallbacks.includes('onRibbonChange')) {
      callbacks.onRibbonChange = (newRibbon: any) => {
        setTabGroups(prev => {
          const newGroups = [...prev];
          const groupIndex = newGroups.findIndex(g =>
            g.tabs.some(t => t.id === tabId)
          );
          if (groupIndex === -1) return prev;
          const tabIndex = newGroups[groupIndex].tabs.findIndex(
            t => t.id === tabId
          );
          if (tabIndex === -1) return prev;
          newGroups[groupIndex].tabs[tabIndex] = {
            ...newGroups[groupIndex].tabs[tabIndex],
            props: {
              ...newGroups[groupIndex].tabs[tabIndex].props,
              ribbon: newRibbon,
              ribbonColor:
                newRibbon === 'none'
                  ? newGroups[groupIndex].tabs[tabIndex].props.ribbonColor
                  : newRibbon,
            },
          };
          return newGroups;
        });
      };
    }

    if (requiredCallbacks.includes('onToggleEmojis')) {
      callbacks.onToggleEmojis = () => setShowEmojis(!showEmojis);
    }

    if (requiredCallbacks.includes('onCloseAllTabs')) {
      callbacks.onCloseAllTabs = closeAllTabs;
    }

    if (requiredCallbacks.includes('onMaxTabWidthChange')) {
      callbacks.onMaxTabWidthChange = setMaxTabWidth;
    }

    if (requiredCallbacks.includes('onRibbonWidthChange')) {
      callbacks.onRibbonWidthChange = setRibbonWidth;
    }

    if (requiredCallbacks.includes('showEmojis')) {
      callbacks.showEmojis = showEmojis;
    }

    if (requiredCallbacks.includes('maxTabWidth')) {
      callbacks.maxTabWidth = maxTabWidth;
    }

    if (requiredCallbacks.includes('ribbonWidth')) {
      callbacks.ribbonWidth = ribbonWidth;
    }

    return callbacks;
  };

  const addTab = (type: TabType) => {
    const typeConfig = getTabTypeConfig(type);
    const groupIndex = tabGroups.findIndex(g => g.id === activeGroupId);

    if (groupIndex === -1) return;

    const group = tabGroups[groupIndex];

    // Check if it's a unique tab type that's already open
    if (typeConfig.isUnique) {
      // Find the tab in any group
      const existingTab = tabGroups
        .flatMap(g => g.tabs)
        .find(tab => tab.tabComponent.getType() === type);
      if (existingTab) {
        // If it's in the current group, just activate it
        if (group.tabs.find(t => t.id === existingTab.id)) {
          setTabGroups(prev => {
            const newGroups = [...prev];
            newGroups[groupIndex] = {
              ...group,
              activeTabId: existingTab.id,
            };
            return newGroups;
          });
        } else {
          // If it's in another group, move it to the current group
          setTabGroups(prev => {
            const newGroups = [...prev];
            const sourceGroupIndex = prev.findIndex(g =>
              g.tabs.some(t => t.id === existingTab.id)
            );
            if (sourceGroupIndex === -1) return prev;

            // Create new arrays to avoid mutating state directly
            const sourceGroup = { ...newGroups[sourceGroupIndex] };
            const targetGroup = { ...newGroups[groupIndex] };

            // Remove tab from source group
            const [movedTab] = sourceGroup.tabs.splice(
              sourceGroup.tabs.findIndex(t => t.id === existingTab.id),
              1
            );
            sourceGroup.tabs = [...sourceGroup.tabs];

            // Insert tab into target group
            targetGroup.tabs.push(movedTab);
            targetGroup.tabs = [...targetGroup.tabs];
            targetGroup.activeTabId = movedTab.id;

            // Update active tab in source group to be the first tab
            if (sourceGroup.tabs.length > 0) {
              sourceGroup.activeTabId = sourceGroup.tabs[0].id;
            }

            // Update the groups
            newGroups[sourceGroupIndex] = sourceGroup;
            newGroups[groupIndex] = targetGroup;

            // If source group is now empty, remove it and ensure remaining group has ID "1"
            if (sourceGroup.tabs.length === 0) {
              const remainingGroup = newGroups.find(
                g => g.id !== sourceGroup.id
              );
              if (remainingGroup) {
                return [
                  {
                    ...remainingGroup,
                    id: '1',
                  },
                ];
              }
            }

            return newGroups;
          });
        }
        return;
      }
    }

    const newId = nextTabId.toString();

    let displayName = t(`tabs.${type}`);
    if (!displayName || displayName.startsWith('?')) {
      const fallbackNames = {
        home: 'Home',
        data: 'Data',
        settings: 'Settings',
        about: 'About',
      };
      displayName = fallbackNames[type] || 'Tab';
    }

    if (!typeConfig.isUnique) {
      const existingTitles = tabGroups
        .flatMap(g => g.tabs)
        .filter(tab => tab.tabComponent.getType() === type)
        .map(tab => tab.tabComponent.getTitle(tab.props));

      let number = 1;
      const numberedTitle = t('tabs.numbered', { name: displayName, number });
      const fallbackNumberedTitle = `${displayName} ${number}`;
      let titleToCheck =
        numberedTitle && !numberedTitle.startsWith('?')
          ? numberedTitle
          : fallbackNumberedTitle;

      while (existingTitles.includes(titleToCheck)) {
        number++;
        const nextNumberedTitle = t('tabs.numbered', {
          name: displayName,
          number,
        });
        const nextFallbackNumberedTitle = `${displayName} ${number}`;
        const nextTitleToCheck =
          nextNumberedTitle && !nextNumberedTitle.startsWith('?')
            ? nextNumberedTitle
            : nextFallbackNumberedTitle;

        if (nextTitleToCheck === titleToCheck) break;
        titleToCheck = nextTitleToCheck;
      }
      displayName = titleToCheck;
    }

    const tabComponent = tabComponentRegistry[type];
    const factory = tabFactoryRegistry[type];

    const requiredCallbacks = factory.getRequiredCallbacks?.() || [];
    const callbacks = provideCallbacks(newId, requiredCallbacks);

    const factoryArgs = {
      id: newId,
      title: displayName,
      ...callbacks,
    };

    const tabProps = factory.createTabProps(factoryArgs);

    const newTabInstance: TabInstance = {
      id: newId,
      tabComponent,
      props: tabProps,
    };

    setNewTabId(newId);
    setTimeout(() => setNewTabId(null), 200);

    setTabGroups(prev => {
      const newGroups = [...prev];
      newGroups[groupIndex] = {
        ...group,
        tabs: [...group.tabs, newTabInstance],
        activeTabId: newId,
      };
      return newGroups;
    });
    setNextTabId(nextTabId + 1);
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
            setViewRatio(1);
            return prev.filter(g => g.id !== groupId);
          }
          // If this was the last tab in the last group, just return an empty group
          return [
            {
              id: groupId,
              tabs: [],
              activeTabId: '',
            },
          ];
        }

        // If the closed tab was active, activate the next tab
        let newActiveTabId = group.activeTabId;
        if (newActiveTabId === tabId) {
          const closedTabIndex = group.tabs.findIndex(tab => tab.id === tabId);
          const nextTabIndex =
            closedTabIndex === group.tabs.length - 1
              ? closedTabIndex - 1
              : closedTabIndex + 1;
          newActiveTabId = group.tabs[nextTabIndex].id;
        }

        const newGroups = [...prev];
        newGroups[groupIndex] = {
          ...group,
          tabs: newTabs,
          activeTabId: newActiveTabId,
        };
        return newGroups;
      });
      setRemovingTabId(null);
    }, delay);
  };

  const moveTab = (
    sourceGroupId: string,
    dragIndex: number,
    targetGroupId: string,
    hoverIndex: number
  ) => {
    console.log('Moving tab:', {
      sourceGroupId,
      dragIndex,
      targetGroupId,
      hoverIndex,
    });
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
          activeTabId: tab.id,
        };

        const updatedSourceGroup = {
          ...sourceGroup,
          tabs: sourceGroup.tabs.filter((_, i) => i !== dragIndex),
          activeTabId: sourceGroup.tabs[0]?.id || '1',
        };

        return [updatedSourceGroup, newGroup];
      });
      return;
    }

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

    // Check if the source group actually contains a tab at the specified dragIndex
    // This warning can be triggered if a tab is moved to a new group and is being dragged back
    // This can be safely ignored, but may be desirable to adjust in the future
    if (dragIndex < 0 || dragIndex >= sourceGroup.tabs.length) {
      console.warn('Invalid dragIndex:', dragIndex, 'for source group with', sourceGroup.tabs.length, 'tabs. Skipping move operation.');
      return;
    }

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
      const newActiveIndex = dragIndex > 0 ? Math.min(dragIndex - 1, sourceGroup.tabs.length - 1) : 0;
      sourceGroup.activeTabId = sourceGroup.tabs[newActiveIndex].id;
    }

    newGroups[sourceGroupIndex] = sourceGroup;
    newGroups[targetGroupIndex] = targetGroup;
    setTabGroups(newGroups);

    // If source group is now empty, remove it and ensure remaining group has ID "1"
    if (sourceGroup.tabs.length === 0) {
      const remainingGroup = newGroups.find(g => g.id !== sourceGroupId);
      if (remainingGroup) {
        setTabGroups([
          {
            ...remainingGroup,
            id: '1',
          },
        ]);
      }
    }
  };

  const splitView = (groupId: string, tabId: string) => {
    // Suppress for mobile
    if (screen.orientation.type.startsWith('portrait')) return;

    // We only want 2 views
    if (tabGroups.length >= 2) return;

    // Initil view ratio is 50-50
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
        activeTabId: tab.id,
      };

      // Remove the tab from the original group
      const updatedSourceGroup = {
        ...sourceGroup,
        tabs: sourceGroup.tabs.filter(t => t.id !== tabId),
        activeTabId: sourceGroup.tabs[0]?.id || '1',
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
      setTabGroups([
        {
          id: '1',
          tabs: [
            {
              id: '1',
              tabComponent: HomeTab,
              props: defaultHomeTabProps,
            },
          ],
          activeTabId: '1',
        },
      ]);
      setNextTabId(2);
      return;
    }

    // No confirmation needed here since SettingsTab handles it
    setTabGroups([
      {
        id: '1',
        tabs: [
          {
            id: '1',
            tabComponent: HomeTab,
            props: defaultHomeTabProps,
          },
        ],
        activeTabId: '1',
      },
    ]);
    setNextTabId(2);
  };

  const renderTabContent = (tabInstance: TabInstance) => {
    const { tabComponent, props } = tabInstance;

    if (!tabComponent) {
      console.error('TabInstance missing tabComponent:', tabInstance);
      return <div>Error: Invalid tab configuration</div>;
    }

    try {
      return tabComponent.render(props);
    } catch (error) {
      console.error('Error rendering tab:', error);
      return <div>Error: Failed to render tab</div>;
    }
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
                flex:
                  tabGroups.length === 1
                    ? 1
                    : groupIndex === 0
                      ? viewRatio
                      : 1 - viewRatio,
              }}
            >
              <div
                className="tabs-container"
                onContextMenu={e => {
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
                  onTabSelect={tabId => {
                    setTabGroups(prev => {
                      const newGroups = [...prev];
                      const groupIndex = newGroups.findIndex(
                        g => g.id === group.id
                      );
                      if (groupIndex !== -1) {
                        newGroups[groupIndex] = {
                          ...newGroups[groupIndex],
                          activeTabId: tabId,
                        };
                      }
                      return newGroups;
                    });
                  }}
                  onTabClose={tabId => closeTab(group.id, tabId)}
                  onTabMove={moveTab}
                  onTabSplit={tabId => splitView(group.id, tabId)}
                  groupId={group.id}
                  totalTabCount={tabGroups.reduce(
                    (sum, g) => sum + g.tabs.length,
                    0
                  )}
                  onAddTab={e => handleAddTabClick(e, group.id)}
                  setViewRatio={setViewRatio}
                  showEmojis={showEmojis}
                  removingTabId={removingTabId}
                  newTabId={newTabId}
                />
              </div>
              <div className="tab-content">
                {group.tabs.find(tab => tab.id === group.activeTabId) &&
                  renderTabContent(
                    group.tabs.find(tab => tab.id === group.activeTabId)!
                  )}
              </div>
              {groupIndex < tabGroups.length - 1 && (
                <div
                  className="view-divider"
                  onMouseDown={handleDividerMouseDown}
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
