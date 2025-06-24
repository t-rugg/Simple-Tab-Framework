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
