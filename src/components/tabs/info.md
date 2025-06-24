# Process for adding a new tab type

## 1. Create Tab Component `yourTab.tsx`

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

## 3. Add to Registry `src/components/TabManager.tsx`

```typescript
import { YourTab } from './tabs/YourTab';
// Add to tabComponentRegistry:
const tabComponentRegistry: Record<TabType, TabComponent> = {
  // existing tabs
  yourTab: YourTab,
  // existing tabs
};
```

## 4. Update Types `src/types/tabs.ts`

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

The `addDividerAfter` property can be included and set to `true` to tell the new tab menu (`TabTypeDropdown.tsx`) to place a divider after that tab. This can be useful for aesthetics.

## 5. Add i18n

Any existing languages should have the tab titles added. For example:

**src/i18n/translations/en.json:**
```json
{ "yourTab": { "title": "Your Tab" } }
```

**src/i18n/translations/fr.json:**
```json
{ "yourTab": { "title": "Votre Onglet" } }
```

**Note:** Unique tabs require a `title` property in i18n, while non-unique tabs can have programmatically generated titles. It is recommended that you give some sort of default title, especially if allowing users to title their tabs themselves.

## Uniqueness

Uniqueness is determined by the `isUnique` field. Unique tabs (`isUnique = true`) can only have one copy in existence, have fixed titles, emoji, and ribbons, and attempting to create a new one will just focus on the existing unique tab. Non-unique tabs (`isUnique = false`) can exist in multiple copies and have distinct titles, emoji, or ribbons. If a tab need only ever exist once, it should be unique (e.g. Home, About, Settings), whereas tabs that dynamically populate from other data should be non-unique.