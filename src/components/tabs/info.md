# Process for adding a new tab type

## 1. Create Tab Component (.tsx)

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../TabContent.css';
import { TabFactory, TabComponentProps, Tab } from '../../types/tabs';

interface YourTabProps extends TabComponentProps {
  onCustomAction?: () => void;
}

export const YourTab: React.FC<YourTabProps> & Tab = ({ onCustomAction }) => {
  const { t } = useTranslation();
  return (
    <div className="tab-content-wrapper">
      <h1>{t('yourTab.title')}</h1>
    </div>
  );
};

YourTab.getTitle = () => 'Your Tab';
YourTab.getType = () => 'yourTab';
YourTab.render = (props?: any) => <YourTab {...props} />;
YourTab.factory = new YourTabFactory();
```

## 2. Create Factory Class

```typescript
export class YourTabFactory implements TabFactory {
  getRequiredCallbacks(): string[] {
    return ['onCustomAction'];
  }
  createTabProps({ title }: { id: string; title: string }) {
    return { title, emoji: '🎯', type: 'yourTab' };
  }
}
```

## 3. Add to Registry (TabManager.tsx)

```typescript
import { YourTab } from './tabs/YourTab';
// Add to tabComponentRegistry:
const tabComponentRegistry: Record<TabType, TabComponent> = {
  // existing tabs
  yourTab: YourTab,
  // existing tabs
};
```

## 4. Update Types (types/tabs.ts)

```typescript
export type TabType = 'home' | 'data' | 'settings' | 'about' | 'yourTab';

// Also add to TAB_TYPES array:
export const TAB_TYPES: TabTypeConfig[] = [
  // ... existing types
  {
    type: 'yourTab',
    displayName: 'Your Tab',
    emoji: '🎯',
    isUnique: false,
  },
];
```

## 5. Add i18n

**en.json:**
```json
{ "yourTab": { "title": "Your Tab" } }
```

**fr.json:**
```json
{ "yourTab": { "title": "Votre Onglet" } }
```