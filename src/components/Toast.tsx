import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    emoji?: string;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, emoji, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast">
            {emoji && <span className="toast-emoji">{emoji}</span>}
            <span className="toast-message">{message}</span>
        </div>
    );
}; 