import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export const ThemeToggle: React.FC = () => {
    const { themeName, toggleTheme } = useTheme();
    const { showToast } = useToast();

    const handleThemeToggle = () => {
        toggleTheme();
        showToast(
            `${themeName === 'light' ? 'Dark' : 'Light'} mode enabled`,
            themeName === 'light' ? '🌙' : '☀️'
        );
    };

    return (
        <button
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${themeName === 'light' ? 'dark' : 'light'} mode`}
        >
            {themeName === 'light' ? '☀️' : '🌙'}
        </button>
    );
};    