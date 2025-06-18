import { RibbonType } from '../styles/RibbonStyles';

export type TabType = 'home' | 'data' | 'settings' | 'about';

export interface TabTypeConfig {
  type: TabType;
  displayName: string;
  emoji: string;
  isUnique: boolean;
  addDividerAfter?: boolean;
  ribbon?: RibbonType;
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
    addDividerAfter: true,
    ribbon: 'none'
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

export const getTabTypeConfig = (type: TabType): TabTypeConfig => {
    const config = TAB_TYPES.find(t => t.type === type);
    if (!config) {
        throw new Error(`Unknown tab type: ${type}`);
    }
    return config;
}; 