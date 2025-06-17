export type TabType = 'home' | 'data' | 'settings' | 'about';

export interface TabTypeConfig {
  type: TabType;
  displayName: string;
  emoji: string;
  isUnique: boolean;
  addDividerAfter?: boolean;
}

export const TAB_TYPES: TabTypeConfig[] = [
  {
    type: 'home',
    displayName: 'Home',
    emoji: '🏠',
    isUnique: true
  },
  {
    type: 'data',
    displayName: 'Data',
    emoji: '📊',
    isUnique: false,
    addDividerAfter: true
  },
  {
    type: 'settings',
    displayName: 'Settings',
    emoji: '⚙️',
    isUnique: true
  },
  {
    type: 'about',
    displayName: 'About',
    emoji: 'ℹ️',
    isUnique: true
  }
];

export const getTabTypeConfig = (type: TabType) => {
    try {
      return TAB_TYPES.find(t => t.type === type);
    }
    catch(e) {
      throw new Error(`Unknown tab type: ${type}`);
    }
}; 