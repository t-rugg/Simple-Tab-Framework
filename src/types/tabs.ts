export type TabType = 'home' | 'data' | 'settings';

export interface TabTypeConfig {
  type: TabType;
  displayName: string;
  emoji: string;
  isUnique: boolean;
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
    isUnique: true
  },
  {
    type: 'settings',
    displayName: 'Settings',
    emoji: '⚙️',
    isUnique: true
  }
];

export const getTabTypeConfig = (type: TabType) => {
    switch (type) {
        case 'home':
            return {
                displayName: 'Home',
                emoji: '🏠',
                isUnique: true
            };
        case 'data':
            return {
                displayName: 'New Data',
                emoji: '📊',
                isUnique: false
            };
        case 'settings':
            return {
                displayName: 'Settings',
                emoji: '⚙️',
                isUnique: true
            };
        default:
            throw new Error(`Unknown tab type: ${type}`);
    }
}; 