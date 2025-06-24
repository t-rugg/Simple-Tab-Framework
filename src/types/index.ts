// Re-export types for better tree-shaking
export type {
  TabType,
  TabInstance,
  TabFactory,
  TabComponent,
  TabComponentProps,
  Tab,
  TabTypeConfig,
  CallbackProvider
} from './tabs';

// Re-export values
export {
  TAB_TYPES,
  getTabTypeConfig
} from './tabs';
