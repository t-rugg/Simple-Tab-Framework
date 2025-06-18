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

// Common interfaces for tab factories
export interface TabFactory {
    createTabProps(args: any): any; // Returns props for TabInstance
    getRequiredCallbacks?(): string[]; // Returns array of callback names this factory needs
}

// Callback provider interface
export interface CallbackProvider {
    onTitleChange: (tabId: string, newTitle: string) => void;
    onRibbonChange: (tabId: string, newRibbon: any) => void;
    onToggleEmojis: () => void;
    onCloseAllTabs: (e?: React.MouseEvent) => void;
    onMaxTabWidthChange: (width: number) => void;
    onRibbonWidthChange: (width: number) => void;
    showEmojis: boolean;
    maxTabWidth: number;
    ribbonWidth: number;
}

// Common interface for all tab components
export interface TabComponentProps {
    // Common props that all tabs might need
    id?: string;
    title?: string;
    // Add any other common props here
}

// Common interfaces for tab components
export interface Tab {
    getTitle(props?: any): string;
    getType(): TabType;
    render(props?: any): React.ReactElement;
    factory: TabFactory; // Static reference to the component's factory
}

export type TabComponent = React.ComponentType<any> & Tab;

// Interface for tab instances used by TabManager
export interface TabInstance {
    id: string;
    tabComponent: Tab;
    props?: any; // Additional props for the tab component
} 