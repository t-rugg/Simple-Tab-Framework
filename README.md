# Simple Tab Framework

A flexible tab management system built with React and Next.js.

## Features

- **Multiple Tab Types**: Support for different types of tabs (Home, Data, Settings, About)
- **Split View**: Create side-by-side views to view two tabs at once
- **Drag and Drop**: Reorder tabs through drag-and-drop
- **Persistent State**: Tab configurations are saved between sessions
- **Internationalization**: Support for multiple languages (English, French)
- **Theme Support**: Light and dark theme switching
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
Simple Tab Framework/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── App.css                  # App-specific styles
│   ├── themes.css               # Theme variables
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   └── play/
│       ├── page.tsx             # Tab manager page
│       ├── loading.css          # Loading screen styles
│       └── play.css             # Page-specific styles
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Tab.tsx          # Individual tab component
│   │   │   ├── TabBar.tsx       # Tab bar component
│   │   │   ├── TabDropdown.tsx  # Tab context menu
│   │   │   ├── TabTypeDropdown.tsx # Tab type selector
│   │   │   ├── ThemeToggle.tsx  # Theme switcher
│   │   │   └── Toast.tsx        # Toast notifications
│   │   ├── tabs/                # Tab-specific components
│   │   │   ├── HomeTab.tsx      # Home tab
│   │   │   ├── DataTab.tsx      # Data tab
│   │   │   ├── SettingsTab.tsx  # Settings tab
│   │   │   ├── AboutTab.tsx     # About tab
│   │   │   └── info.md          # Tab development guide
│   │   ├── TabManager.tsx       # Main tab manager
│   │   ├── TabManager.css       # Tab manager styles
│   │   └── I18nProvider.tsx     # i18n provider
│   ├── context/                 # React contexts
│   │   ├── index.ts             # Barrel exports for contexts
│   │   ├── ThemeContext.tsx     # Theme context
│   │   └── ToastContext.tsx     # Toast context
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts             # Barrel exports for i18n
│   │   ├── i18n.ts              # i18n configuration
│   │   └── translations/        # Translation files
│   │       ├── en.json          # English translations
│   │       └── fr.json          # French translations
│   ├── types/                   # TypeScript types
│   │   ├── index.ts             # Barrel exports for types
│   │   └── tabs.ts              # Tab-related types
│   └── styles/                  # Dynamic styles
│       ├── index.ts             # Barrel exports for styles
│       └── RibbonStyles.ts      # Ribbon styling logic
├── public/                      # Static assets
├── .eslintrc.json              # ESLint configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (can be installed with npm, see Installation step 1)

### Installation

1. Install pnpm:
```bash
npm install -g pnpm
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

5. Navigate to `/play` to use the tab manager

## Development

### Adding New Tab Types

See `src/components/tabs/info.md` for detailed instructions on adding new tab types.

### Code Organization

- **UI Components**: Reusable components in `src/components/ui/`
- **Tab Components**: Tab-specific components in `src/components/tabs/`
- **Contexts**: React contexts in `src/context/`
- **Types**: TypeScript type definitions in `src/types/`
- **i18n**: Internationalization in `src/i18n/`

### Import Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/components/*` - Component imports
- `@/ui/*` - UI component imports (direct imports for optimal tree-shaking)
- `@/tabs/*` - Tab component imports (direct imports for optimal tree-shaking)
- `@/context/*` - Context imports (barrel exports available)
- `@/types/*` - Type imports (barrel exports available)
- `@/i18n/*` - i18n imports (barrel exports available)
- `@/styles/*` - Style imports (barrel exports available)

### Import Examples

**Direct imports (recommended for components):**
```typescript
import { Tab } from '@/ui/Tab';
import { TabBar } from '@/ui/TabBar';
import { HomeTab } from '@/tabs/HomeTab';
import { I18nProvider } from '@/components/I18nProvider';
```

**Barrel exports (for contexts, types, styles):**
```typescript
import { ThemeProvider, useTheme } from '@/context/index';
import { TabType, TabInstance } from '@/types/index';
import { RibbonType, useRibbonStyles } from '@/styles/index';
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **i18next** - Internationalization
- **react-dnd** - Drag and drop functionality
- **CSS Modules** - Component-scoped styling

## Performance Optimizations

- **Tree-shaking friendly imports**: Direct component imports for optimal bundle size
- **Optimized barrel exports**: Specific named exports for contexts, types, and styles
- **Package import optimization**: Next.js experimental `optimizePackageImports` enabled
- **Type-safe imports**: Proper TypeScript isolatedModules compliance
