import { TabManager } from './components/TabManager';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';
import './themes.css';
import './styles/RibbonStyles';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="app">
          <TabManager />
          <ThemeToggle />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
