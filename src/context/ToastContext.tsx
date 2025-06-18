import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

interface ToastContextType {
  showToast: (message: string, emoji?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    emoji?: string;
  } | null>(null);

  const showToast = useCallback((message: string, emoji?: string) => {
    // Clear any existing toast first
    setToast(null);
    // Use setTimeout to ensure the state update happens in the next tick
    setTimeout(() => {
      setToast({ message, emoji });
    }, 0);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          emoji={toast.emoji}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
