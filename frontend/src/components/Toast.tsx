import React from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
    const getColorClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-gray-100/90 text-gray-800 border border-gray-300';
            case 'error':
                return 'bg-gray-900/90 text-white border border-gray-700';
            case 'info':
                return 'bg-gray-200/90 text-gray-800 border border-gray-300';
            case 'warning':
                return 'bg-gray-300/90 text-gray-900 border border-gray-400';
            default:
                return 'bg-gray-50/90 text-gray-700 border border-gray-100';
        }
    };

    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${getColorClasses()}`}>
            <div className="flex items-center gap-3">
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;
