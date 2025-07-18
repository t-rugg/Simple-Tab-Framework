'use client';

import { useEffect } from 'react';

// Define the type for ribbon colors - can be 'none' or any hex color
export type RibbonType = 'none' | string;

export const ribbonStyles = `
.tab {
    position: relative;
    overflow: hidden;
}

.tab[data-ribbon]:not([data-ribbon="none"])::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--ribbonWidth, 6px);
    height: 100%;
    background-color: var(--ribbonColor);
    border-radius: 2px 0 0 2px;
}

.tab[data-ribbon="none"]::before {
    display: none;
}
`;

// Function to validate if a string is a valid hex color
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Hook to inject the ribbonStyles CSS into the DOM
export const useRibbonStyles = () => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Check if styles are already injected
      const existingStyle = document.getElementById('ribbon-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'ribbon-styles';
        style.textContent = ribbonStyles;
        document.head.appendChild(style);
      }
    }
  }, []);
};
